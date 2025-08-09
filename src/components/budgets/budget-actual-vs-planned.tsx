import { StyleSheet, View } from 'react-native';
import { memo, useCallback, useMemo } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { Surface, Text, useTheme } from 'react-native-paper';

import moment from 'moment';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { and, asc, inArray, sql } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import NoItemNotice from '../reusables/no-items-notice';

type Budget = { budget: schema.Budget; category: schema.Category };

type Props = {
	selectedDate: Date;
	budgets: Budget[];
};

function BudgetActualVSPlanned({ budgets, selectedDate }: Props) {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const budgetIds = budgets.map((b) => b.budget.category_id).sort();

	const startOfMonth = useMemo(
		() => moment(selectedDate).startOf('month').format('YYYY-MM-DD'),
		[selectedDate]
	);
	const endOfMonth = useMemo(
		() => moment(selectedDate).endOf('month').format('YYYY-MM-DD'),
		[selectedDate]
	);

	const getActualSpending = useCallback(() => {
		return drizzleDb
			.select({
				amount: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'expense' THEN ${schema.transactions.amount} ELSE 0 END), 0)`,
			})
			.from(schema.transactions)
			.where(
				and(
					inArray(schema.transactions.category_id, budgetIds),
					sql`DATE(${schema.transactions.created_at}) BETWEEN DATE(${startOfMonth}) AND DATE(${endOfMonth})`
				)
			)
			.groupBy(schema.transactions.category_id)
			.orderBy(asc(schema.transactions.category_id));
	}, [budgetIds, selectedDate]);

	const { data: actualSpending } = useLiveQuery(getActualSpending());

	const renderer = () => {
		if (actualSpending.length)
			return (
				<RenderChart
					budgets={budgets}
					actualSpending={actualSpending}
					budgetIds={budgetIds}
				/>
			);

		return <NoItemNotice />;
	};

	return (
		<Surface mode="flat" elevation={2} style={styles.container}>
			<Text style={styles.chartTitle} variant="bodyLarge">
				Actual vs Planned
			</Text>

			<View>{renderer()}</View>
		</Surface>
	);
}

type RenderChart = {
	budgets: Budget[];
	actualSpending: { amount: number }[];
	budgetIds: number[];
};

function RenderChart({ budgets, actualSpending, budgetIds }: RenderChart) {
	const theme = useTheme();
	const { currentCurrencySymbol } = usePreferredCurrencyStore();

	const getChartData = useMemo(() => {
		const sortedBudgets = budgets.sort(
			(a, b) => a.budget.category_id - b.budget.category_id
		);

		const data = [];

		for (let i = 0; i < sortedBudgets.length; i++) {
			data.push({
				value: sortedBudgets[i].budget.max_spending,
				label: sortedBudgets[i].category.label,
				spacing: 2,
				labelWidth: 150,
				labelTextStyle: {
					color: 'gray',
					fontFamily: 'Manrope-Regular',
					fontSize: 10,
				},
				frontColor: '#175b9bff',
				topLabelComponent: () => (
					<Text style={{ color: 'gray', fontSize: 9 }}>
						{currentCurrencySymbol}{' '}
						{Number(sortedBudgets[i].budget.max_spending).toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}
					</Text>
				),
			});
			data.push({
				value: actualSpending[i].amount,
				frontColor: '#ED6665',
				spacing: 10,
				topLabelComponent: () => (
					<Text style={{ color: 'gray', fontSize: 9 }}>
						{currentCurrencySymbol}{' '}
						{Number(actualSpending[i].amount).toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}
					</Text>
				),
			});
		}

		return data;
	}, [budgetIds, actualSpending, currentCurrencySymbol]);

	return (
		<>
			<BarChart
				data={getChartData}
				barWidth={75}
				barBorderRadius={120}
				topLabelTextStyle={{
					fontFamily: 'Manrope-Regular',
					color: theme.colors.onSurface,
					fontSize: 9,
				}}
				height={200}
				hideYAxisText
				showScrollIndicator={false}
				spacing={0}
				hideAxesAndRules
				isAnimated
				animationDuration={0.5}
				adjustToWidth
			/>

			<View style={styles.legend}>
				<View style={styles.legendColumn}>
					<View
						style={[styles.legendDot, { backgroundColor: '#175b9bff' }]}
					></View>
					<Text variant="labelMedium" style={styles.legendText}>
						Planned
					</Text>
				</View>

				<View style={styles.legendColumn}>
					<View
						style={[styles.legendDot, { backgroundColor: '#ED6665' }]}
					></View>
					<Text variant="labelMedium" style={styles.legendText}>
						Actual
					</Text>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 16,
		gap: 16,
	},
	chartTitle: {
		fontFamily: 'Manrope-SemiBold',
	},
	legend: {
		flexDirection: 'row',
		gap: 24,
		justifyContent: 'center',
		marginTop: 12,
	},
	legendColumn: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	legendDot: {
		width: 10,
		height: 10,
		borderRadius: 100,
	},
	legendText: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
	},
});

export default memo(BudgetActualVSPlanned);

