import { useState } from 'react';
import { FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, eq } from 'drizzle-orm';

import * as schema from '@/db/schema';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransferCard from '@/src/components/reusables/transfer-card';

export default function TransfersScreen() {
	const theme = useTheme();
	const [date] = useState(new Date());

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data } = useLiveQuery(
		drizzleDb
			.select()
			.from(schema.transfers)
			.where(
				and(
					eq(schema.transfers.created_month, date.getMonth()),
					eq(schema.transfers.created_year, date.getFullYear())
				)
			)
			.innerJoin(
				schema.transferCategories,
				eq(schema.transfers.category_id, schema.transferCategories.id)
			)
			.innerJoin(
				schema.accounts,
				eq(schema.transfers.to_account_id, schema.accounts.id)
			)
	);

	return (
		<FlatList
			style={{ paddingTop: 60, backgroundColor: theme.colors.background }}
			data={data}
			ListEmptyComponent={<NoItemNotice />}
			renderItem={({ item }) => (
				<TransferCard
					key={item.transfers.id}
					data={item.transfers}
					account={item.accounts}
					category={item.transfer_categories}
				/>
			)}
		/>
	);
}
