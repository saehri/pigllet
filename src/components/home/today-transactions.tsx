import { useState } from 'react';
import { MD3Theme, Text, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { and, asc, eq } from 'drizzle-orm';

import NoItemNotice from '../reusables/no-items-notice';
import TransactionCard from '../reusables/transaction-card';

export default function TodayTransaction() {
	const theme = useTheme();
	const [todayDate] = useState(new Date());

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data } = useLiveQuery(
		drizzleDb
			.select()
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.created_date, todayDate.getDate()),
					eq(schema.transactions.created_month, todayDate.getMonth() + 1),
					eq(schema.transactions.created_year, todayDate.getFullYear())
				)
			)
			.innerJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.innerJoin(
				schema.accounts,
				eq(schema.transactions.account_id, schema.accounts.id)
			)
			.orderBy(asc(schema.transactions.created_date))
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
				{data.map(({ transactions, accounts, categories }) => (
					<TransactionCard
						key={transactions.id}
						transactionType={transactions.type as any}
						account={accounts}
						category={categories}
						data={transactions}
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
					{todayDate.toLocaleDateString('id-ID', {
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
		fontFamily: 'Inter-Black',
		lineHeight: 23,
	},
	subtitle: {
		fontFamily: 'Inter-Regular',
		opacity: 0.8,
		paddingHorizontal: 10,
		borderRadius: 100,
	},
});
