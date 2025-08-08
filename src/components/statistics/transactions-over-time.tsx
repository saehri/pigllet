import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

import getLocaleByCurrencySymbol from '@/utils/locale-getter';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { and, asc, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import moment from 'moment';
import { transactionColorMap } from '@/utils/utils';

import { ArrowDownIcon, ArrowUpIcon, FocusIcon } from 'lucide-react-native';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

type Props = {
	selectedDate?: Date;
	range?: 'month' | 'year';
	transactionType: schema.TransactionType;
	name: string;
	descriptions?: string;
};

export default function TransactionsOverTime({
	selectedDate,
	range,
	transactionType,
	name,
	descriptions,
}: Props) {
	const theme = useTheme();

	// for ordering the data
	const [order, setOrder] = useState<'asc' | 'desc'>('desc');

	// set up the database
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const getDateGroupingRule = (range?: 'month' | 'year') => {
		if (range === 'month') {
			return sql<string>`DATE(${schema.transactions.created_at})`;
		}
		if (range === 'year') {
			return sql<string>`strftime('%Y-%m', ${schema.transactions.created_at})`;
		}
		return sql<string>`strftime('%Y', ${schema.transactions.created_at})`;
	};

	const getSumByTypeInDateRange = () => {
		const whereConditions = [eq(schema.transactions.type, transactionType)];

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
				label: schema.transactions.created_at,
			})
			.from(schema.transactions)
			.where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
			.orderBy(
				order === 'desc'
					? desc(schema.transactions.created_at)
					: asc(schema.transactions.created_at)
			)
			.groupBy(getDateGroupingRule(range));
	};

	const getMaxValue = () => {
		const whereConditions = [eq(schema.transactions.type, transactionType)];

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
						<ArrowDownIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					) : (
						<ArrowUpIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					)}
				</Button>
			</View>

			{chartData.length ? (
				<ChartRenderer
					chartData={chartData}
					chartMaxValue={chartMaxValue[0].maxValue}
					transactionType={transactionType}
					range={range}
				/>
			) : (
				<View style={styles.emptyAndLoadingContainer}>
					<Text
						variant="bodyLarge"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.5 }}
					>
						No data available to display at the moment.
					</Text>
				</View>
			)}
		</Surface>
	);
}

type ChartRendererProps = {
	chartData: { value: number; label: string }[];
	chartMaxValue: number;
	transactionType: schema.TransactionType;
	range?: 'month' | 'year';
};

function ChartRenderer({
	chartData,
	chartMaxValue,
	transactionType,
	range,
}: ChartRendererProps) {
	const { currentCurrencySymbol } = usePreferredCurrencyStore();

	const theme = useTheme();

	return (
		<View style={styles.chartContainer}>
			<BarChart
				barWidth={75}
				barBorderRadius={120}
				formatYLabel={(label) =>
					`${Number(label).toLocaleString(
						getLocaleByCurrencySymbol(currentCurrencySymbol)
					)}`
				}
				topLabelTextStyle={{
					fontFamily: 'Manrope-Regular',
					color: theme.colors.onSurface,
					fontSize: 9,
				}}
				height={200}
				maxValue={chartMaxValue}
				data={chartData.map((data) => ({
					...data,
					label: moment(data.label).format(
						range === 'month'
							? 'MMM D, YYYY'
							: range === 'year'
								? 'MMM, YYYY'
								: 'YYYY'
					),
					topLabelComponent: () => (
						<Text style={{ color: theme.colors.onSurface, fontSize: 9 }}>
							{currentCurrencySymbol}{' '}
							{Number(data.value).toLocaleString(
								getLocaleByCurrencySymbol(currentCurrencySymbol)
							)}
						</Text>
					),
				}))}
				hideYAxisText
				showScrollIndicator={false}
				frontColor={transactionColorMap[transactionType]}
				spacing={10}
				hideAxesAndRules
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
	cardContainer: {
		marginTop: 24,
		gap: 2,
	},
});

