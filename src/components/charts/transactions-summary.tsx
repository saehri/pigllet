import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useContext } from 'react';

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

export default function TransactionsSummary({ selectedDate, range }: Props) {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	// const startDate =

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
			<Card label="Total income" value={totalIncome} position="first" />
			<Card label="Total expenses" value={totalExpense} position="middle" />
			<Card label="Total transfer" value={totalTransfer} position="middle" />
			<Card label="Net balance" value={netBalance} position="last" />
		</View>
	);
}

type CardProps = {
	label: string;
	value: number;
	position: 'first' | 'middle' | 'last' | 'only';
};

function Card({ label, value, position }: CardProps) {
	const theme = useTheme();

	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const borderRadius = {
		tr: {
			first: 16,
			middle: 3,
			only: 16,
			last: 3,
		},
		tl: {
			first: 16,
			middle: 3,
			only: 16,
			last: 3,
		},
		br: {
			first: 3,
			middle: 3,
			only: 16,
			last: 16,
		},
		bl: {
			first: 3,
			middle: 3,
			only: 16,
			last: 16,
		},
	};

	return (
		<Surface
			mode="flat"
			elevation={1}
			style={[
				styles.itemContainer,
				{
					backgroundColor: theme.colors.tertiaryContainer,
					borderTopRightRadius: borderRadius.tr[position],
					borderTopLeftRadius: borderRadius.tl[position],
					borderBottomLeftRadius: borderRadius.bl[position],
					borderBottomRightRadius: borderRadius.br[position],
				},
			]}
		>
			<Text
				style={[styles.itemText, { color: theme.colors.onTertiaryContainer }]}
				variant="bodyMedium"
			>
				{label}
			</Text>
			<Text
				style={[styles.itemText, { color: theme.colors.onTertiaryContainer }]}
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
		width: '100%',
		gap: 2,
		overflow: 'hidden',
		paddingHorizontal: 24,
	},
	itemContainer: {
		flexDirection: 'row',
		paddingVertical: 12,
		paddingHorizontal: 16,
		justifyContent: 'space-between',
	},
	itemText: {
		fontFamily: 'Manrope-Regular',
	},
});

