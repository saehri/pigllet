import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import EditExpenseForm from '@/src/components/forms/expense/edit-expense-form';
import EditIncomeForm from '@/src/components/forms/income/edit-income-form';

export default function ExpenseDetail() {
	const theme = useTheme();
	const { id, type } = useLocalSearchParams();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const parsedId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
	const { data } = useLiveQuery(
		drizzleDb
			.select()
			.from(schema.transactions)
			.where(eq(schema.transactions.id, parsedId))
			.innerJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.innerJoin(
				schema.accounts,
				eq(schema.transactions.account_id, schema.accounts.id)
			)
	);

	if (!data.length)
		return (
			<View
				style={{
					backgroundColor: theme.colors.background,
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<ActivityIndicator size={20} color={theme.colors.onSurface} />
			</View>
		);

	if (type === 'income')
		return (
			<ScrollView style={{ backgroundColor: theme.colors.background }}>
				<EditIncomeForm
					initialAccount={data[0].accounts}
					initialCategory={data[0].categories}
					initialFormValue={data[0].transactions}
				/>
			</ScrollView>
		);

	return (
		<ScrollView style={{ backgroundColor: theme.colors.background }}>
			<EditExpenseForm
				initialAccount={data[0].accounts}
				initialCategory={data[0].categories}
				initialFormValue={data[0].transactions}
			/>
		</ScrollView>
	);
}
