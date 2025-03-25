import { useSQLiteContext } from 'expo-sqlite';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import * as schema from '@/db/schema';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import AccountCard from '@/src/components/settings/account-card';

export default function AccountsSettingScreen() {
	const theme = useTheme();

	return (
		<ScrollView style={{ backgroundColor: theme.colors.background }}>
			<AccountCards />
		</ScrollView>
	);
}

function AccountCards() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data } = useLiveQuery(drizzleDb.select().from(schema.accounts));

	if (!data.length) return <NoItemNotice />;

	return (
		<View style={{ padding: 16, gap: 16 }}>
			{data.map((card) => (
				<AccountCard
					clickable
					balance={card.balance}
					created_at={card.created_at}
					name={card.name}
					number={card.number}
					id={card.id}
					image={card.image}
					is_cash={card.is_cash}
					key={card.id}
				/>
			))}
		</View>
	);
}
