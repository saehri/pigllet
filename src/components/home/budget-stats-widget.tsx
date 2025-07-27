import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import WidgetWrapper from '../reusables/widget-wrapper';

export default function BudgetStatsWidget() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data: budgets } = useLiveQuery(
		drizzleDb.select().from(schema.budgets)
	);

	return (
		<WidgetWrapper
			customStyle={{
				marginHorizontal: 16,
				marginVertical: 5,
				display: budgets.length ? 'flex' : 'none',
			}}
		>
			<View style={{ gap: 10 }}>
				<Text variant="bodyMedium" style={styles.title}>
					Budget summary
				</Text>
			</View>
		</WidgetWrapper>
	);
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.8,
	},
});

