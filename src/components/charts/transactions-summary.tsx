import { memo, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

import moment from 'moment';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, gte, lte, sql } from 'drizzle-orm';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

type Props = {
	selectedDate?: Date;
	range?: 'month' | 'year';
};

const TransactionsSummary = memo(function TransactionsSummary({
	selectedDate,
	range,
}: Props) {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const getSumByTypeInDateRange = (selectedDate?: Date) => {
		const whereConditions = [];

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
				totalExpense: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'expense' THEN ${schema.transactions.amount} ELSE 0 END), 0)`,
				totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'income' THEN ${schema.transactions.amount} ELSE 0 END), 0)`,
				totalTransfer: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'transfer' THEN ${schema.transactions.amount} ELSE 0 END), 0)`,
			})
			.from(schema.transactions)
			.where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
	};

	const { data } = useLiveQuery(getSumByTypeInDateRange(selectedDate), [
		selectedDate,
	]);

	if (!data.length)
		return (
			<View style={styles.container}>
				<Text variant="titleLarge" style={styles.title}>
					Overview
				</Text>

				<View style={styles.list}>
					<Card label="Total income" value={0} />
					<Card label="Total expenses" value={0} />
					<Card label="Total transfer" value={0} />
					<Card label="Net balance" value={0} />
				</View>
			</View>
		);

	const { totalExpense, totalIncome, totalTransfer } = data[0];
	const netBalance = totalIncome - totalExpense;

	return (
		<View style={styles.container}>
			<Text variant="titleLarge" style={styles.title}>
				Overview
			</Text>

			<View style={styles.list}>
				<Card label="Total income" value={totalIncome} />
				<Card label="Total expenses" value={totalExpense} />
				<Card label="Total transfer" value={totalTransfer} />
				<Card label="Net balance" value={netBalance} />
			</View>
		</View>
	);
});

export default TransactionsSummary;

type CardProps = {
	label: string;
	value: number;
};

function Card({ label, value }: CardProps) {
	const theme = useTheme();

	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	return (
		<Surface mode="flat" elevation={3} style={[styles.itemContainer]}>
			<Text
				style={[styles.itemText, { color: theme.colors.onSurface }]}
				variant="bodyMedium"
			>
				{label}
			</Text>
			<Text
				style={[
					{
						color: theme.colors.onSurface,
						fontFamily: 'Manrope-Medium',
						opacity: 1,
					},
				]}
				variant="bodyMedium"
			>
				{`${currentCurrencySymbol} ${value.toLocaleString(
					getLocaleByCurrencySymbol(currentCurrencySymbol)
				)}`}
			</Text>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
		paddingHorizontal: 16,
	},
	list: {
		gap: 2,
	},
	itemContainer: {
		flexDirection: 'row',
		paddingVertical: 16,
		paddingHorizontal: 24,
		justifyContent: 'space-between',
		borderRadius: 1000,
	},
	itemText: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
	},
	title: {
		fontFamily: 'Manrope-Regular',
	},
});

