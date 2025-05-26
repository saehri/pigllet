import { FlatList } from 'react-native';

import * as schema from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import TransactionCard from '@/src/components/reusables/transaction-card';

export default function TransactionHistory() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const relatedAccounts = alias(schema.accounts, 'related_accounts'); // Alias for related accounts

	const { data: transactions } = useLiveQuery(
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
			.orderBy(desc(schema.transactions.created_at))
	);

	return (
		<FlatList
			showsVerticalScrollIndicator={false}
			data={transactions}
			renderItem={({ item }) => (
				<TransactionCard
					key={item.transaction?.id}
					transactionType={item.transaction?.type as any}
					account={item.account as schema.Account}
					relatedAccount={item.related_account as schema.Account}
					category={item.category as schema.Category}
					data={item.transaction as schema.Transaction}
					showDate
				/>
			)}
		/>
	);
}

