import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import BalanceStats from './balance-stats';
import WidgetWrapper from '../reusables/widget-wrapper';

export default function AccountOverviewWidget() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data: balances } = useLiveQuery(
		drizzleDb.select({ balance: schema.accounts.balance }).from(schema.accounts)
	);
	const accountBalance = balances
		.map((bl) => bl.balance)
		.reduce((a, b) => a + b, 0);

	return (
		<WidgetWrapper
			title="Overview"
			customStyle={{ marginHorizontal: 16, marginBottom: 5 }}
		>
			<BalanceStats balance={accountBalance} />
		</WidgetWrapper>
	);
}
