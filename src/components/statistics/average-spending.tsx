import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import moment from 'moment';

import * as schema from '@/db/schema';
import { and, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { transactionColorMap, formatCurrencyByCode } from '@/utils/utils';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

type Props = {
	selectedDate?: Date;
	range?: 'month' | 'year' | 'week';
};

export default function AverageSpending({ selectedDate, range }: Props) {
	const { currentCurrencyCode, showFraction, accountingStyle, showSuffix } =
		useCurrencyStyle();

	const drizzleDb = useDrizzleDB();

	const divisor = () => {
		if (range === 'week') return 7;
		if (range === 'month') return moment(selectedDate).daysInMonth();
		if (range === 'year') {
			const totalDaysInLeapYear = 366;
			const totalDaysInYear = 365;
			const isLeapYear = moment(selectedDate).isLeapYear();

			if (isLeapYear) return totalDaysInLeapYear;
			return totalDaysInYear;
		}
	};

	const getAverageSpending = () => {
		const whereConditions = [];

		if (selectedDate && range) {
			const startDate = moment(selectedDate)
				.startOf(range)
				.format('YYYY-MM-DD');
			const endDate = moment(selectedDate).endOf(range).format('YYYY-MM-DD');

			whereConditions.push(
				sql`DATE(${schema.transactions.created_at}) BETWEEN DATE(${startDate}) AND DATE(${endDate})`
			);
		}

		return drizzleDb
			.select({
				value: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'expense' THEN ${schema.transactions.amount} ELSE 0 END) / ${divisor()}, 0)`,
			})
			.from(schema.transactions)
			.where(and(...whereConditions));
	};

	const getPrevMonthAverageSpending = () => {
		const whereConditions = [];

		if (selectedDate && range) {
			let startDate, endDate;

			if (range === 'week') {
				const prevWeek = moment(selectedDate)
					.startOf('week')
					.add(-1, 'weeks')
					.toDate();

				startDate = moment(prevWeek).startOf('week').format('YYYY-MM-DD');
				endDate = moment(prevWeek).endOf('week').format('YYYY-MM-DD');
			} else {
				startDate = moment(selectedDate)
					.set('M', moment(selectedDate).month() - 1)
					.startOf(range)
					.format('YYYY-MM-DD');

				endDate = moment(selectedDate)
					.set('M', moment(selectedDate).month() - 1)
					.endOf(range)
					.format('YYYY-MM-DD');
			}

			whereConditions.push(
				sql`DATE(${schema.transactions.created_at}) BETWEEN DATE(${startDate}) AND DATE(${endDate})`
			);
		}

		return drizzleDb
			.select({
				value: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'expense' THEN ${schema.transactions.amount} ELSE 0 END) / ${divisor()}, 0)`,
			})
			.from(schema.transactions)
			.where(and(...whereConditions));
	};

	// get the average spending in current and previous month
	const { data: averageSpending } = useLiveQuery(getAverageSpending(), [
		selectedDate,
	]);
	const { data: prevMonthAvgSpending } = useLiveQuery(
		getPrevMonthAverageSpending(),
		[selectedDate]
	);

	// format current average spending according to user preference
	const formattedAverageSpending = formatCurrencyByCode(
		averageSpending[0]?.value ?? 0,
		currentCurrencyCode,
		showFraction,
		accountingStyle,
		showSuffix
	);

	const curr = averageSpending[0]?.value ?? 0;
	const prev = prevMonthAvgSpending[0]?.value ?? 0;

	const averageSpendingDiff = curr - prev;
	const spendingPercentage =
		prev === 0 ? 0 : (averageSpendingDiff / prev) * 100;

	const labelDisplay = () => {
		if (range === 'week' || range === 'month') return 'Daily average spending';
		return 'Monthly average spending';
	};

	return (
		<Surface mode="flat" elevation={2} style={[styles.chart]}>
			<Text style={styles.chartTitle} variant="bodyLarge">
				{labelDisplay()}
			</Text>

			{averageSpending.length ? (
				<View>
					<Text
						variant="headlineSmall"
						style={{ fontFamily: 'Manrope-Regular' }}
					>
						{formattedAverageSpending}
					</Text>

					<Text
						variant="labelMedium"
						style={{
							fontFamily: 'Manrope-Regular',
							color:
								spendingPercentage > 0
									? transactionColorMap.expense
									: transactionColorMap.income,
						}}
					>
						{spendingPercentage > 0 && '+'}
						{spendingPercentage.toFixed(0)}% from previous {range}.
					</Text>
				</View>
			) : (
				<Text
					variant="bodyLarge"
					style={{ fontFamily: 'Manrope-Regular', opacity: 0.5 }}
				>
					No data available to display at the moment.
				</Text>
			)}
		</Surface>
	);
}

const styles = StyleSheet.create({
	chart: {
		padding: 24,
		borderRadius: 40,
		gap: 16,
	},
	chartTitle: {
		fontFamily: 'Manrope-SemiBold',
	},
});

