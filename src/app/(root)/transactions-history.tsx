import { FlatList } from 'react-native';

import * as schema from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import TransactionCard from '@/src/components/reusables/transaction-card';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import useTransactionsManager from '@/src/hooks/useTransactionsManager';

export default function TransactionHistory() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const relatedAccounts = alias(schema.accounts, 'related_accounts'); // Alias for related accounts

	const { loadTransactionsData } = useTransactionsManager({});

	const { data: transactions } = useLiveQuery(loadTransactionsData());

	return (
		<FlatList
			showsVerticalScrollIndicator={false}
			data={transactions}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<TransactionCard
					key={item.transaction?.id}
					data={item.transaction}
					showDate
					disableFirstButton
					disableSecondButton
				/>
			)}
		/>
	);
}

