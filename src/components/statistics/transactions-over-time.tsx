import moment from 'moment';
import * as schema from '@/db/schema';
import { StyleSheet, View } from 'react-native';
import { memo, useCallback, useState } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, asc, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import {
	CalendarArrowDownIcon,
	CalendarArrowUpIcon,
} from 'lucide-react-native';
import Animated, {
	RotateInDownRight,
	RotateOutDownLeft,
} from 'react-native-reanimated';

import { transactionColorMap } from '@/utils/utils';
import { fastSpatialEasing, formatCurrencyByCode } from '@/utils/utils';

import { useCurrencyStyle } from '@/store/useCurrencyStyle';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

type Props = {
	selectedDate?: Date;
	range?: 'month' | 'year';
	transactionType: schema.TransactionType;
	name: string;
	descriptions?: string;
};

function TransactionsOverTime({
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
	const drizzleDb = useDrizzleDB();

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

	const contentRenderer = useCallback(() => {
		if (chartData.length)
			return (
				<ChartRenderer
					chartData={chartData}
					chartMaxValue={chartMaxValue[0].maxValue}
					transactionType={transactionType}
					range={range}
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

	const buttonIconRenderer = () => {
		if (order === 'desc')
			return (
				<CalendarArrowDownIcon
					size={20}
					strokeWidth={1.5}
					color={theme.colors.onSecondaryContainer}
				/>
			);

		return (
			<CalendarArrowUpIcon
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onSecondaryContainer}
			/>
		);
	};

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
					<Animated.View
						key={order}
						entering={RotateInDownRight.duration(500).easing(fastSpatialEasing)}
						exiting={RotateOutDownLeft.duration(500).easing(fastSpatialEasing)}
					>
						{buttonIconRenderer()}
					</Animated.View>
				</Button>
			</View>

			{contentRenderer()}
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
	const { currentCurrencyCode, showFraction, accountingStyle, showSuffix } =
		useCurrencyStyle();

	const theme = useTheme();

	const getChartLabel = () => {
		if (range === 'month') return 'MMM D, YYYY';
		if (range === 'year') return 'MMM, YYYY';
		return 'YYYY';
	};

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
				height={200}
				maxValue={chartMaxValue}
				data={chartData.map((data) => ({
					...data,
					label: moment(data.label).format(getChartLabel()),
					topLabelComponent: () => (
						<Text
							style={{
								color: theme.colors.onSurface,
								fontSize: 9,
								fontFamily: 'Manrope-Regular',
							}}
							ellipsizeMode="tail"
							numberOfLines={1}
						>
							{formatCurrencyByCode(
								data.value,
								currentCurrencyCode,
								showFraction,
								accountingStyle,
								showSuffix
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

export default memo(TransactionsOverTime);

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

