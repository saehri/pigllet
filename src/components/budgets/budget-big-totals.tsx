import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';
import { and, inArray, sql } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { useCurrencyStyle } from '@/store/useCurrencyStyle';

import moment from 'moment';
import { formatCurrencyByCode } from '@/utils/utils';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

type Props = {
	selectedDate: moment.MomentInput;
	budgetIds: number[];
	transactionCategoryIds: number[];
};

function BudgetBigTotals({
	selectedDate,
	budgetIds,
	transactionCategoryIds,
}: Props) {
	const theme = useTheme();
	const drizzleDb = useDrizzleDB();

	const { currentCurrencyCode, showFraction, accountingStyle, showSuffix } =
		useCurrencyStyle();

	const formatToCurrency = useCallback(
		(amount: number) => {
			return formatCurrencyByCode(
				amount,
				currentCurrencyCode,
				showFraction,
				accountingStyle,
				showSuffix
			);
		},
		[currentCurrencyCode, showFraction, accountingStyle, showSuffix]
	);

	const startOfMonth = moment(selectedDate)
		.startOf('month')
		.format('YYYY-MM-DD');
	const endOfMonth = moment(selectedDate).endOf('month').format('YYYY-MM-DD');

	const getTotalBudget = useMemo(() => {
		return drizzleDb
			.select({
				value: sql<number>`SUM(${schema.budgets.limit})`,
			})
			.from(schema.budgets)
			.where(
				and(
					inArray(schema.budgets.id, budgetIds),
					sql`DATE(${schema.budgets.created_at}) BETWEEN DATE(${startOfMonth}) AND DATE(${endOfMonth})`
				)
			)
			.groupBy(sql<string>`strftime('%Y-%m', ${schema.budgets.created_at})`);
	}, [selectedDate, budgetIds]);

	const getTotalSpent = useMemo(() => {
		return drizzleDb
			.select({
				value: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'expense' THEN ${schema.transactions.amount} ELSE 0 END), 0)`,
			})
			.from(schema.transactions)
			.where(
				and(
					inArray(schema.transactions.category_id, transactionCategoryIds),
					sql`DATE(${schema.transactions.created_at}) BETWEEN DATE(${startOfMonth}) AND DATE(${endOfMonth})`
				)
			);
	}, [selectedDate, budgetIds]);

	const getTotalIncome = useMemo(() => {
		return drizzleDb
			.select({
				value: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'income' THEN ${schema.transactions.amount} ELSE 0 END), 0)`,
			})
			.from(schema.transactions)
			.where(
				and(
					sql`DATE(${schema.transactions.created_at}) BETWEEN DATE(${startOfMonth}) AND DATE(${endOfMonth})`
				)
			);
	}, [selectedDate, budgetIds]);

	const { data: totalLimit } = useLiveQuery(getTotalBudget, [selectedDate]);
	const { data: spent } = useLiveQuery(getTotalSpent, [selectedDate]);
	const { data: income } = useLiveQuery(getTotalIncome, [selectedDate]);

	const totalBudget = totalLimit[0]?.value ?? 0;
	const totalSpent = spent[0]?.value ?? 0;
	const totalIncome = income[0]?.value ?? 0;
	const potentialMoneySaved = totalIncome - totalBudget;
	const remaining = totalBudget - totalSpent;
	const remainingPercentage =
		totalBudget !== 0 ? 100 - (totalSpent / totalBudget) * 100 : 0;

	return (
		<>
			<View style={styles.row}>
				<Surface mode="flat" elevation={2} style={styles.container}>
					<Text
						variant="labelSmall"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.7 }}
					>
						Planned budget*
					</Text>

					<Text variant="titleMedium" style={{ fontFamily: 'Manrope-Medium' }}>
						{formatToCurrency(totalBudget)}
					</Text>

					<Text
						variant="labelSmall"
						style={{
							fontFamily: 'Manrope-Regular',
							opacity: 0.7,
							fontSize: 9,
						}}
					>
						*Sum of all budget
					</Text>
				</Surface>

				<Surface mode="flat" elevation={2} style={styles.container}>
					<Text
						variant="labelSmall"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.7 }}
					>
						Projected savings*
					</Text>

					<Text variant="titleMedium" style={{ fontFamily: 'Manrope-Medium' }}>
						{formatToCurrency(potentialMoneySaved)}
					</Text>

					<Text
						variant="labelSmall"
						style={{
							fontFamily: 'Manrope-Regular',
							opacity: 0.7,
							fontSize: 9,
						}}
					>
						*Income - Total budget
					</Text>
				</Surface>
			</View>

			<View style={styles.row}>
				<Surface mode="flat" elevation={2} style={styles.container}>
					<Text
						variant="labelSmall"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.7 }}
					>
						This month's income
					</Text>

					<Text variant="titleMedium" style={{ fontFamily: 'Manrope-Medium' }}>
						{formatToCurrency(totalIncome)}
					</Text>
				</Surface>

				<Surface mode="flat" elevation={2} style={styles.container}>
					<Text
						variant="labelSmall"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.7 }}
					>
						Total spending
					</Text>

					<Text variant="titleMedium" style={{ fontFamily: 'Manrope-Medium' }}>
						{formatToCurrency(totalSpent)}
					</Text>
				</Surface>
			</View>

			<View style={styles.row}>
				<Surface mode="flat" elevation={2} style={styles.container}>
					<Text
						variant="labelSmall"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.7 }}
					>
						Left to spend (amnt)
					</Text>

					<Text variant="titleMedium" style={{ fontFamily: 'Manrope-Medium' }}>
						{formatToCurrency(remaining)}
					</Text>
				</Surface>

				<Surface mode="flat" elevation={2} style={styles.container}>
					<Text
						variant="labelSmall"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.7 }}
					>
						Left to spend (%)
					</Text>

					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
						<Text
							variant="titleMedium"
							style={{ fontFamily: 'Manrope-Medium' }}
						>
							{remainingPercentage.toFixed(0)}%
						</Text>

						<View
							style={[
								styles.progressContainer,
								{
									backgroundColor: theme.colors.background,
									borderColor: theme.colors.elevation.level3,
								},
							]}
						>
							<View
								style={{
									height: '100%',
									width: `${remainingPercentage}%`,
									backgroundColor: theme.colors.primary,
									borderRadius: 6,
								}}
							></View>
						</View>
					</View>
				</Surface>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	row: {
		flex: 1,
		flexDirection: 'row',
		gap: 4,
	},
	container: {
		padding: 8,
		paddingHorizontal: 18,
		borderRadius: 24,
		flex: 1,
	},
	progressContainer: {
		flex: 1,
		height: 18,
		borderRadius: 6,
		top: 1,
		borderWidth: 1,
		overflow: 'hidden',
	},
});

export default memo(BudgetBigTotals);

