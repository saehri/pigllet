import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';

import * as schema from '@/db/schema';
import { alias } from 'drizzle-orm/sqlite-core';
import { desc, eq } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { ChevronRightIcon } from 'lucide-react-native';

import TransactionCard from '@/src/components/reusables/transaction-card';
import BudgetStatsWidget from '@/src/components/home/budget-stats-widget';
import AccountOverviewWidget from '@/src/components/home/account-overview-widget';
import NoItemNotice from '@/src/components/reusables/no-items-notice';

export default function TransactionScreen() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const router = useRouter();

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
			.limit(15)
			.orderBy(desc(schema.transactions.created_at))
	);

	return (
		<FlatList
			showsVerticalScrollIndicator={false}
			data={transactions}
			ListEmptyComponent={<NoItemNotice />}
			ListHeaderComponent={
				<View>
					<AccountOverviewWidget />
					<BudgetStatsWidget />

					<View style={styles.headerContainer}>
						<Text variant="titleLarge" style={styles.title}>
							Recent transactions
						</Text>

						<Button
							mode="text"
							compact
							icon={({ color, size }) => (
								<ChevronRightIcon size={size} color={color} />
							)}
							contentStyle={styles.buttonContent}
							labelStyle={styles.buttonLabel}
							onPress={() => router.push('/transactions-history')}
						>
							See all
						</Button>
					</View>
				</View>
			}
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
		marginTop: 16,
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
	buttonContent: { flexDirection: 'row-reverse' },
	buttonLabel: { fontFamily: 'Inter-Regular', fontSize: 16 },
});

