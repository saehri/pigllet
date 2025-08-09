import { memo, useCallback, useMemo } from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { and, inArray, sql } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import moment from 'moment';

type Props = {
	selectedDate: Date;
	budgetIds: number[];
};

function BudgetBigTotals({ selectedDate, budgetIds }: Props) {
	const theme = useTheme();
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { currentCurrencySymbol } = usePreferredCurrencyStore();
	const formatToCurrency = useCallback(
		(amount: number) => {
			return `${currentCurrencySymbol} ${amount.toLocaleString(
				getLocaleByCurrencySymbol(currentCurrencySymbol)
			)}`;
		},
		[currentCurrencySymbol]
	);

	const startOfMonth = useMemo(
		() => moment(selectedDate).startOf('month').format('YYYY-MM-DD'),
		[selectedDate]
	);
	const endOfMonth = useMemo(
		() => moment(selectedDate).endOf('month').format('YYYY-MM-DD'),
		[selectedDate]
	);

	const getTotalBudget = useCallback(() => {
		return drizzleDb
			.select({
				value: sql<number>`SUM(${schema.budgets.max_spending})`,
			})
			.from(schema.budgets)
			.where(
				sql`DATE(${schema.budgets.created_at}) BETWEEN DATE(${startOfMonth}) AND DATE(${endOfMonth})`
			)
			.groupBy(sql<string>`strftime('%Y-%m', ${schema.budgets.created_at})`);
	}, [selectedDate]);

	const getTotalSpent = useCallback(() => {
		return drizzleDb
			.select({
				value: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'expense' THEN ${schema.transactions.amount} ELSE 0 END), 0)`,
			})
			.from(schema.transactions)
			.where(
				and(
					inArray(schema.transactions.category_id, budgetIds),
					sql`DATE(${schema.transactions.created_at}) BETWEEN DATE(${startOfMonth}) AND DATE(${endOfMonth})`
				)
			);
	}, [selectedDate, budgetIds]);

	const { data: totalLimit } = useLiveQuery(getTotalBudget(), [selectedDate]);
	const { data: spent } = useLiveQuery(getTotalSpent(), [selectedDate]);

	const totalBudget = totalLimit[0]?.value ?? 0;
	const totalSpent = spent[0]?.value ?? 0;
	const remaining = totalBudget - totalSpent;
	const remainingPercentage =
		totalBudget !== 0 ? 100 - (totalSpent / totalBudget) * 100 : 0;

	return (
		<>
			<Surface
				mode="flat"
				elevation={2}
				style={[
					styles.container,
					{ borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
				]}
			>
				<View style={styles.column}>
					<Text
						variant="labelSmall"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.7 }}
					>
						Total budget this month
					</Text>

					<Text variant="titleMedium" style={{ fontFamily: 'Manrope-Medium' }}>
						{formatToCurrency(totalBudget)}
					</Text>
				</View>

				<View style={styles.column}>
					<Text
						variant="labelSmall"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.7 }}
					>
						Total spent this month
					</Text>

					<Text variant="titleMedium" style={{ fontFamily: 'Manrope-Medium' }}>
						{formatToCurrency(totalSpent)}
					</Text>
				</View>
			</Surface>

			<Surface
				mode="flat"
				elevation={2}
				style={[
					styles.container,
					{
						borderTopLeftRadius: 6,
						borderTopRightRadius: 6,
						alignItems: 'flex-end',
					},
				]}
			>
				<View style={styles.column}>
					<Text
						variant="labelSmall"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.7 }}
					>
						Remaining budget
					</Text>

					<Text variant="titleMedium" style={{ fontFamily: 'Manrope-Medium' }}>
						{formatToCurrency(remaining)}
					</Text>
				</View>

				<View
					style={[
						styles.column,
						{ flexDirection: 'row', alignItems: 'center', gap: 8 },
					]}
				>
					<Text variant="titleMedium" style={{ fontFamily: 'Manrope-Medium' }}>
						{remainingPercentage.toFixed(0)}%
					</Text>

					<View
						style={[
							styles.progressContainer,
							{ backgroundColor: theme.colors.primaryContainer },
						]}
					>
						<View
							style={{
								height: '100%',
								width: `${remainingPercentage}%`,
								backgroundColor: theme.colors.primary,
							}}
						></View>
					</View>
				</View>
			</Surface>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		paddingHorizontal: 18,
		gap: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderRadius: 16,
	},
	column: { flex: 1 },
	progressContainer: {
		flex: 1,
		height: 20,
		borderRadius: 6,
		overflow: 'hidden',
	},
});

export default memo(BudgetBigTotals);

