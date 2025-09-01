import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

import moment from 'moment';

import * as schema from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, gte, lte, sql } from 'drizzle-orm';

import { cardBorderRadius, formatCurrencyByCode } from '@/utils/utils';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

type Props = {
	selectedDate?: Date;
	range?: 'month' | 'year' | 'week';
};

const TransactionsSummary = memo(function TransactionsSummary({
	selectedDate,
	range,
}: Props) {
	const drizzleDb = useDrizzleDB();

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
					<Card position="first" label="Total income" value={0} />
					<Card position="middle" label="Total expenses" value={0} />
					<Card position="middle" label="Total transfer" value={0} />
					<Card position="last" label="Net balance" value={0} />
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
				<Card position="first" label="Total income" value={totalIncome} />
				<Card position="middle" label="Total expenses" value={totalExpense} />
				<Card position="middle" label="Total transfer" value={totalTransfer} />
				<Card position="last" label="Net balance" value={netBalance} />
			</View>
		</View>
	);
});

export default TransactionsSummary;

type CardProps = {
	label: string;
	value: number;
	position: CardPositionsTypes;
};

function Card({ label, value, position }: CardProps) {
	const theme = useTheme();

	const { currentCurrencyCode, showFraction, accountingStyle, showSuffix } =
		useCurrencyStyle();

	const cardRadiusStyle = useMemo(
		() => ({
			borderTopLeftRadius: cardBorderRadius[position].tl,
			borderTopRightRadius: cardBorderRadius[position].tr,
			borderBottomLeftRadius: cardBorderRadius[position].bl,
			borderBottomRightRadius: cardBorderRadius[position].br,
		}),
		[position]
	);

	return (
		<Surface
			mode="flat"
			elevation={5}
			style={[styles.itemContainer, cardRadiusStyle]}
		>
			<Text
				style={[styles.itemText, { color: theme.colors.onSurface }]}
				variant="bodyMedium"
			>
				{label}
			</Text>
			<Text
				style={[styles.itemText, { color: theme.colors.onSurface }]}
				variant="bodyMedium"
			>
				{formatCurrencyByCode(
					value,
					currentCurrencyCode,
					showFraction,
					accountingStyle,
					showSuffix
				)}
			</Text>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
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
		fontFamily: 'Manrope-Medium',
	},
	title: {
		fontFamily: 'Manrope-Regular',
	},
});

