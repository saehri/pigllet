import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import {
	CalendarArrowDownIcon,
	CalendarArrowUpIcon,
} from 'lucide-react-native';

import { formatCurrencyByCode } from '@/utils/utils';

import * as schema from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, asc, desc, eq, gte, lte, sql } from 'drizzle-orm';

import moment from 'moment';
import { transactionColorMap } from '@/utils/utils';

import { useCurrencyStyle } from '@/store/useCurrencyStyle';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

type Props = {
	selectedDate?: Date;
	range?: 'month' | 'year';
	type: schema.TransactionType;
	name: string;
	descriptions?: string;
};

export default function TransactionsByCategory({
	selectedDate,
	range,
	type,
	name,
	descriptions,
}: Props) {
	const theme = useTheme();

	// for ordering the data
	const [order, setOrder] = useState<'asc' | 'desc'>('desc');

	// set up the database
	const drizzleDb = useDrizzleDB();

	const getSumByTypeInDateRange = () => {
		const whereConditions = [eq(schema.transactions.type, type)];

		if (selectedDate && range) {
			whereConditions.push(
				gte(
					schema.transactions.created_at,
					moment(selectedDate).startOf(range).format('YYYY-MM-DD')
				)
			);
			whereConditions.push(
				lte(
					schema.transactions.created_at,
					moment(selectedDate).endOf(range).format('YYYY-MM-DD')
				)
			);
		}

		return drizzleDb
			.select({
				value: sql<number>`SUM(${schema.transactions.amount})`,
				label: schema.categories.label,
				iconName: schema.categories.icon_name,
			})
			.from(schema.transactions)
			.innerJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
			.groupBy(schema.categories.label)
			.orderBy(
				order === 'desc'
					? desc(sql<number>`SUM(${schema.transactions.amount})`)
					: asc(sql<number>`SUM(${schema.transactions.amount})`)
			);
	};

	const getMaxValue = () => {
		const whereConditions = [eq(schema.transactions.type, type)];

		if (selectedDate && range) {
			whereConditions.push(
				gte(
					schema.transactions.created_at,
					moment(selectedDate).startOf(range).format('YYYY-MM-DD')
				)
			);
			whereConditions.push(
				lte(
					schema.transactions.created_at,
					moment(selectedDate).endOf(range).format('YYYY-MM-DD')
				)
			);
		}

		return drizzleDb
			.select({
				maxValue: sql<number>`SUM(${schema.transactions.amount})`,
			})
			.from(schema.transactions)
			.where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
	};

	const { data: chartData } = useLiveQuery(getSumByTypeInDateRange(), [
		selectedDate,
		order,
	]);
	const { data: chartMaxValue } = useLiveQuery(getMaxValue(), [selectedDate]);

	const contentRenderer = useCallback(() => {
		if (chartData.length)
			return (
				<ChartRenderer
					chartData={chartData}
					chartMaxValue={chartMaxValue[0].maxValue}
					transactionType={type}
				/>
			);

		return (
			<View style={styles.emptyAndLoadingContainer}>
				<Text
					variant="bodyLarge"
					style={{ fontFamily: 'Manrope-Regular', opacity: 0.5 }}
				>
					No data available to display at the moment.
				</Text>
			</View>
		);
	}, [chartData]);

	return (
		<Surface mode="flat" elevation={2} style={styles.chart}>
			<View style={styles.chartHeader}>
				<View style={{ flex: 0.9 }}>
					<Text style={styles.chartTitle} variant="bodyLarge">
						{name}
					</Text>
					<Text style={styles.chartSubtitle} variant="bodySmall">
						{descriptions}
					</Text>
				</View>

				<Button
					mode="contained-tonal"
					compact
					style={{ height: 40 }}
					onPress={() => setOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
				>
					{order === 'desc' ? (
						<CalendarArrowDownIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					) : (
						<CalendarArrowUpIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					)}
				</Button>
			</View>

			{contentRenderer()}
		</Surface>
	);
}

type ChartRendererProps = {
	chartData: { value: number; label: string; iconName: string }[];
	chartMaxValue: number;
	transactionType: schema.TransactionType;
};

function ChartRenderer({
	chartData,
	chartMaxValue,
	transactionType,
}: ChartRendererProps) {
	const theme = useTheme();
	const { currentCurrencyCode, showFraction, accountingStyle, showSuffix } =
		useCurrencyStyle();

	return (
		<View style={styles.chartContainer}>
			<BarChart
				barWidth={75}
				barBorderRadius={120}
				formatYLabel={(label) =>
					formatCurrencyByCode(
						Number(label),
						currentCurrencyCode,
						showFraction,
						accountingStyle,
						showSuffix
					)
				}
				hideYAxisText
				height={200}
				maxValue={chartMaxValue}
				data={chartData.map((data) => ({
					...data,
					topLabelComponent: () => (
						<Text style={{ color: theme.colors.onSurface, fontSize: 9 }}>
							{formatCurrencyByCode(
								Number(data.value),
								currentCurrencyCode,
								showFraction,
								accountingStyle,
								showSuffix
							)}
						</Text>
					),
				}))}
				frontColor={transactionColorMap[transactionType]}
				spacing={10}
				hideAxesAndRules
				showScrollIndicator={false}
				xAxisLabelTextStyle={{
					fontFamily: 'Manrope-Regular',
					textTransform: 'capitalize',
					fontSize: 10,
					color: theme.colors.onBackground,
				}}
				isAnimated
				animationDuration={0.5}
				adjustToWidth
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	chart: {
		borderRadius: 40,
		gap: 16,
		paddingBottom: 24,
	},
	chartHeader: {
		flexDirection: 'row',
		padding: 24,
		paddingBottom: 0,
		gap: 24,
		justifyContent: 'space-between',
	},
	chartTitle: {
		fontFamily: 'Manrope-SemiBold',
	},
	chartSubtitle: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
	},
	emptyAndLoadingContainer: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	chartContainer: {
		width: '100%',
		justifyContent: 'center',
		paddingLeft: 16,
	},
});

