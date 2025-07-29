import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useContext } from 'react';

import moment from 'moment';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { and, gte, lte, sql } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

type Props = {
	selectedDate?: Date;
	range?: 'month' | 'year';
};

export default function TransactionsSummary({ selectedDate, range }: Props) {
	const theme = useTheme();

	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const getSumByTypeInDateRange = (selectedDate?: Date) => {
		const whereConditions = [];

		if (selectedDate && range) {
			whereConditions.push(
				gte(
					schema.transactions.created_at,
					moment(selectedDate).startOf(range).toISOString()
				)
			);
			whereConditions.push(
				lte(
					schema.transactions.created_at,
					moment(selectedDate).endOf(range).toISOString()
				)
			);
		}

		return drizzleDb
			.select({
				expense: sql<number>`SUM(CASE WHEN ${schema.transactions.type} = 'expense' THEN ${schema.transactions.amount} ELSE 0 END)`,
				income: sql<number>`SUM(CASE WHEN ${schema.transactions.type} = 'income' THEN ${schema.transactions.amount} ELSE 0 END)`,
				transfer: sql<number>`SUM(CASE WHEN ${schema.transactions.type} = 'transfer' THEN ${schema.transactions.amount} ELSE 0 END)`,
			})
			.from(schema.transactions)
			.where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
	};

	const { data } = useLiveQuery(getSumByTypeInDateRange(selectedDate), [
		selectedDate,
	]);

	const totalExpense = data[0]?.expense || 0;
	const totalIncome = data[0]?.income || 0;
	const totalTransfer = data[0]?.transfer || 0;
	const netBalance = totalIncome - totalExpense;

	return (
		<View style={styles.container}>
			<Surface
				mode="flat"
				elevation={1}
				style={[
					styles.itemContainer,
					{
						borderTopRightRadius: 16,
						borderTopLeftRadius: 16,
					},
				]}
			>
				<Text style={styles.itemText} variant="bodyMedium">
					Total income
				</Text>
				<Text style={styles.itemText} variant="bodyMedium">
					{`${currentCurrencySymbol} ${totalIncome.toLocaleString(
						getLocaleByCurrencySymbol(currentCurrencySymbol)
					)}`}
				</Text>
			</Surface>

			<Surface mode="flat" elevation={1} style={[styles.itemContainer]}>
				<Text style={styles.itemText} variant="bodyMedium">
					Total expense
				</Text>
				<Text style={styles.itemText} variant="bodyMedium">
					{`${currentCurrencySymbol} ${totalExpense.toLocaleString(
						getLocaleByCurrencySymbol(currentCurrencySymbol)
					)}`}
				</Text>
			</Surface>

			<Surface mode="flat" elevation={1} style={[styles.itemContainer]}>
				<Text style={styles.itemText} variant="bodyMedium">
					Total transfer
				</Text>
				<Text style={styles.itemText} variant="bodyMedium">
					{`${currentCurrencySymbol} ${totalTransfer.toLocaleString(
						getLocaleByCurrencySymbol(currentCurrencySymbol)
					)}`}
				</Text>
			</Surface>

			<Surface
				mode="flat"
				elevation={1}
				style={[
					styles.itemContainer,
					{
						borderBottomRightRadius: 16,
						borderBottomLeftRadius: 16,
						backgroundColor: theme.colors.tertiaryContainer,
					},
				]}
			>
				<Text style={styles.itemText} variant="bodyMedium">
					Net balance
				</Text>
				<Text style={styles.itemText} variant="bodyMedium">
					{`${currentCurrencySymbol} ${netBalance.toLocaleString(
						getLocaleByCurrencySymbol(currentCurrencySymbol)
					)}`}
				</Text>
			</Surface>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		gap: 2,
		overflow: 'hidden',
		height: 198,
	},
	itemContainer: {
		flexDirection: 'row',
		padding: 14,
		paddingHorizontal: 16,
		justifyContent: 'space-between',
		borderRadius: 6,
	},
	itemText: {
		fontFamily: 'Manrope-Regular',
	},
});

