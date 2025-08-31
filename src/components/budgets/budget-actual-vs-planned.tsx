import { StyleSheet, View } from 'react-native';
import { memo, useCallback, useMemo } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { Surface, Text, useTheme } from 'react-native-paper';

import moment from 'moment';

import * as schema from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';
import { and, asc, eq, gte, inArray, lte, sql } from 'drizzle-orm';

import { formatCurrencyByCode } from '@/utils/utils';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import NoItemNotice from '../reusables/no-items-notice';

type Budget = { budget: schema.Budget; category: schema.Category };

type Props = {
	selectedDate: Date;
	budgets: Budget[];
};

function BudgetActualVSPlanned({ budgets, selectedDate }: Props) {
	const drizzleDb = useDrizzleDB();

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
				amount: sql<number>`
        COALESCE(
          SUM(
            CASE 
              WHEN ${schema.transactions.type} = 'expense' 
              THEN ${schema.transactions.amount} 
              ELSE 0 
            END
          ),
          0
        )
      `,
			})
			.from(schema.budgets)
			.leftJoin(
				schema.transactions,
				and(
					eq(schema.budgets.category_id, schema.transactions.category_id),
					gte(sql`DATE(${schema.transactions.created_at})`, startOfMonth),
					lte(sql`DATE(${schema.transactions.created_at})`, endOfMonth)
				)
			)
			.where(inArray(schema.budgets.category_id, budgetIds))
			.groupBy(schema.budgets.category_id)
			.orderBy(asc(schema.budgets.category_id));
	}, [budgetIds, selectedDate]);

	const { data: actualSpending } = useLiveQuery(getActualSpending(), [
		budgetIds,
		selectedDate,
	]);

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
				Planned vs Actual
			</Text>

			<View>
				{renderer()}

				<View style={styles.legend}>
					<View style={styles.legendColumn}>
						<View
							style={[styles.legendDot, { backgroundColor: '#006cd1ff' }]}
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
			</View>
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
	const { currentCurrencyCode, showFraction, accountingStyle } =
		usePreferredCurrencyStore();

	const getChartData = useMemo(() => {
		const sortedBudgets = budgets.sort(
			(a, b) => a.budget.category_id - b.budget.category_id
		);

		const data = [];

		for (let i = 0; i < sortedBudgets.length; i++) {
			data.push({
				value: sortedBudgets[i].budget.limit,
				label: sortedBudgets[i].category.label,
				spacing: 2,
				labelWidth: 150,
				labelTextStyle: {
					color: 'gray',
					fontFamily: 'Manrope-Regular',
					fontSize: 10,
				},
				frontColor: '#006cd1ff',
				topLabelComponent: () => (
					<Text style={{ color: 'gray', fontSize: 9 }}>
						{formatCurrencyByCode(
							sortedBudgets[i]?.budget.limit ?? 0,
							currentCurrencyCode,
							showFraction,
							accountingStyle
						)}
					</Text>
				),
			});
			data.push({
				value: actualSpending[i]?.amount ?? 0,
				frontColor: '#ED6665',
				spacing: 24,
				topLabelComponent: () => (
					<Text style={{ color: 'gray', fontSize: 9 }}>
						{formatCurrencyByCode(
							actualSpending[i]?.amount ?? 0,
							currentCurrencyCode,
							showFraction,
							accountingStyle
						)}
					</Text>
				),
			});
		}

		return data;
	}, [budgetIds, actualSpending, currentCurrencyCode]);

	return (
		<BarChart
			data={getChartData}
			barWidth={75}
			barBorderRadius={120}
			topLabelTextStyle={{
				fontFamily: 'Manrope-Regular',
				color: theme.colors.onSurface,
				fontSize: 9,
			}}
			hideYAxisText
			showScrollIndicator={false}
			spacing={0}
			hideAxesAndRules
			isAnimated
			animationDuration={0.5}
			adjustToWidth
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 16,
		paddingLeft: 3,
		gap: 16,
	},
	chartTitle: {
		fontFamily: 'Manrope-SemiBold',
		marginLeft: 13,
	},
	legend: {
		flexDirection: 'row',
		gap: 24,
		justifyContent: 'center',
		marginTop: 12,
		marginLeft: 16,
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

