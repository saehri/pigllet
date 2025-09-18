import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Surface, Text, useTheme } from 'react-native-paper';

import moment from 'moment';

import * as schema from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';
import { and, asc, eq, gte, inArray, lte, sql, sum } from 'drizzle-orm';

import { formatCurrencyByCode } from '@/utils/utils';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';

import NoItemNotice from '../reusables/no-items-notice';

type Budget = { budget: schema.Budget; category: schema.Category };

type Props = {
	selectedDate: Date;
	budgets: Budget[];
};

function BudgetActualVSPlanned({ budgets, selectedDate }: Props) {
	const drizzleDb = useDrizzleDB();
	const budgetIds = useMemo(
		() => budgets.map((b) => b.budget.category_id).sort(),
		[budgets.length]
	);

	const startOfMonth = moment(selectedDate)
		.startOf('month')
		.format('YYYY-MM-DD');
	const endOfMonth = moment(selectedDate).endOf('month').format('YYYY-MM-DD');

	const getActualSpending = drizzleDb
		.select({ amount: sum(schema.transactions.amount) })
		.from(schema.transactions)
		.where(
			and(
				eq(schema.transactions.type, 'expense'),
				inArray(schema.transactions.category_id, budgetIds),
				eq(schema.budgets.category_id, schema.transactions.category_id),
				gte(sql`DATE(${schema.transactions.created_at})`, startOfMonth),
				lte(sql`DATE(${schema.transactions.created_at})`, endOfMonth)
			)
		)
		.leftJoin(
			schema.budgets,
			eq(schema.budgets.category_id, schema.transactions.category_id)
		)
		.groupBy(schema.budgets.id)
		.orderBy(asc(schema.budgets.category_id));

	const { data: actualSpending } = useLiveQuery(getActualSpending, [
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
	actualSpending: { amount: string | null }[];
	budgetIds: number[];
};

function RenderChart({ budgets, actualSpending, budgetIds }: RenderChart) {
	const theme = useTheme();
	const { currentCurrencyCode, showFraction, accountingStyle, showSuffix } =
		useCurrencyStyle();

	const getChartData = useMemo(() => {
		const sortedBudgets = budgets.sort(
			(a, b) => a.budget.category_id - b.budget.category_id
		);

		const data = [];

		for (let i = 0; i < sortedBudgets.length; i++) {
			data.push({
				value: sortedBudgets[i].budget.limit,
				label: sortedBudgets[i].category.label,
				spacing: 4,
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
							sortedBudgets[i].budget.limit ?? 0,
							currentCurrencyCode,
							showFraction,
							accountingStyle,
							showSuffix
						)}
					</Text>
				),
			});
			data.push({
				value: Number(actualSpending[i]?.amount) ?? 0,
				frontColor: '#ED6665',
				spacing: 22,
				topLabelComponent: () => (
					<Text style={{ color: 'gray', fontSize: 9 }}>
						{formatCurrencyByCode(
							Number(actualSpending[i]?.amount) ?? 0,
							currentCurrencyCode,
							showFraction,
							accountingStyle,
							showSuffix
						)}
					</Text>
				),
			});
		}

		return data;
	}, [
		budgetIds,
		actualSpending,
		currentCurrencyCode,
		showFraction,
		accountingStyle,
		showSuffix,
	]);

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
			height={105}
			stepHeight={10}
			hideYAxisText
			showScrollIndicator={false}
			spacing={0}
			hideAxesAndRules
			isAnimated
			animationDuration={0.5}
			adjustToWidth
			disablePress
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 24,
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

