import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import BalanceStats from './balance-stats';
import WidgetWrapper from '../reusables/widget-wrapper';
import HomeAccountViewer from './home-account-viewer';

export default function AccountOverviewWidget() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data: accounts } = useLiveQuery(
		drizzleDb.select().from(schema.accounts)
	);
	const accountBalance = accounts
		.map((bl) => bl.balance)
		.reduce((a, b) => a + b, 0);

	return (
		<WidgetWrapper customStyle={{ marginHorizontal: 16, marginBottom: 5 }}>
			<BalanceStats balance={accountBalance} />
			<HomeAccountViewer accounts={accounts} />
		</WidgetWrapper>
	);
}

