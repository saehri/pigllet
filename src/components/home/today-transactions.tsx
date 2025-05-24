import { useState } from 'react';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';

import NoItemNotice from '../reusables/no-items-notice';
import TransactionCard from '../reusables/transaction-card';
import { alias } from 'drizzle-orm/sqlite-core';
import { toYYYYMMDD } from '@/utils/utils';

export default function TodayTransaction() {
	const theme = useTheme();
	const [todayDate] = useState(new Date());

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const relatedAccounts = alias(schema.accounts, 'related_accounts'); // Alias for related accounts

	const { data } = useLiveQuery(
		drizzleDb
			.select({
				transaction: {
					id: schema.transactions.id,
					amount: schema.transactions.amount,
					note: schema.transactions.note,
					account_id: schema.transactions.account_id,
					related_account_id: schema.transactions.related_account_id,
					category_id: schema.transactions.category_id,
					type: schema.transactions.type,
					image: schema.transactions.image,
					created_at: schema.transactions.created_at,
				},

				account: {
					id: schema.accounts.id,
					name: schema.accounts.name,
					number: schema.accounts.number,
					balance: schema.accounts.balance,
					is_cash: schema.accounts.is_cash,
					image: schema.accounts.image,
					created_at: schema.accounts.created_at,
				},

				category: {
					id: schema.categories.id,
					label: schema.categories.label,
					icon_name: schema.categories.icon_name,
					type: schema.categories.type,
				},

				related_account: {
					id: relatedAccounts.id,
					name: relatedAccounts.name,
					number: relatedAccounts.number,
					balance: relatedAccounts.balance,
					is_cash: relatedAccounts.is_cash,
					image: relatedAccounts.image,
					created_at: relatedAccounts.created_at,
				},
			})
			.from(schema.transactions)
			.where(
				sql`DATE(transactions.created_at) = DATE(${toYYYYMMDD(todayDate)})`
			)
			.leftJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.leftJoin(
				schema.accounts,
				eq(schema.transactions.account_id, schema.accounts.id)
			)
			.leftJoin(
				relatedAccounts,
				eq(schema.transactions.related_account_id, relatedAccounts.id)
			)
	);

	if (!data.length) {
		return (
			<Wrapper theme={theme} todayDate={todayDate}>
				<NoItemNotice />
			</Wrapper>
		);
	}

	return (
		<Wrapper theme={theme} todayDate={todayDate}>
			<View>
				{data.map(({ account, transaction, category, related_account }) => (
					<TransactionCard
						key={transaction?.id}
						transactionType={transaction?.type as any}
						account={account as schema.Account}
						relatedAccount={related_account as schema.Account}
						category={category as schema.Category}
						data={transaction as schema.Transaction}
					/>
				))}
			</View>
		</Wrapper>
	);
}

type WrapperProps = {
	children: React.ReactNode;
	theme: MD3Theme;
	todayDate: Date;
};

function Wrapper({ children, theme, todayDate }: WrapperProps) {
	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text variant="titleLarge" style={styles.title}>
					Today transactions
				</Text>

				<Text
					variant="titleSmall"
					style={[
						styles.subtitle,
						{ backgroundColor: theme.colors.elevation.level5 },
					]}
				>
					{todayDate.toLocaleDateString('en-US', {
						dateStyle: 'medium',
					})}
				</Text>
			</View>

			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 28,
		gap: 10,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingRight: 13,
	},
	title: {
		fontFamily: 'Inter-Regular',
		lineHeight: 23,
	},
	subtitle: {
		fontFamily: 'Inter-Regular',
		opacity: 0.8,
		paddingHorizontal: 10,
		borderRadius: 100,
	},
});

