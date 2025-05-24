import { Trash2 } from 'lucide-react-native';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ToastAndroid } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

type Props = {
	transactionId: number;
};

export default function DeleteTransactionsDialog({ transactionId }: Props) {
	const theme = useTheme();
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const router = useRouter();

	const [visible, setVisible] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const openDialog = () => setVisible(true);
	const closeDialog = () => setVisible(false);

	async function deleteTransaction() {
		try {
			setLoading(true);

			const transaction = await drizzleDb
				.select()
				.from(schema.transactions)
				.where(eq(schema.transactions.id, transactionId));
			const account = await drizzleDb
				.select()
				.from(schema.accounts)
				.where(eq(schema.accounts.id, transaction[0].account_id));

			let relatedAccount: schema.Account | undefined = undefined;
			if (transaction[0].related_account_id) {
				const relAccount = await drizzleDb
					.select()
					.from(schema.accounts)
					.where(eq(schema.accounts.id, transaction[0].related_account_id));
				relatedAccount = relAccount[0];
			}

			// delete the transactions
			await drizzleDb
				.delete(schema.transactions)
				.where(eq(schema.transactions.id, transactionId));

			// update the account balance
			if (transaction[0].type === 'transfer') {
				const mainAccountBalance = account[0].balance + transaction[0].amount;
				const relatedAccountBalance =
					account[0].balance - transaction[0].amount;

				// update the account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: mainAccountBalance,
					})
					.where(eq(schema.accounts.id, account[0].id));
				// update the account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: relatedAccountBalance,
					})
					.where(eq(schema.accounts.id, relatedAccount?.id as number));
			} else {
				let newBalance = 0;
				if (transaction[0].type === 'expense') {
					newBalance = account[0].balance + transaction[0].amount;
				} else {
					newBalance = account[0].balance - transaction[0].amount;
				}

				// update the account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: newBalance,
					})
					.where(eq(schema.accounts.id, account[0].id));
			}

			ToastAndroid.show('Record deleted successfully!', ToastAndroid.SHORT);
			closeDialog();

			router.back();
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={closeDialog}>
					<Dialog.Title style={{ fontFamily: 'Inter-Regular' }}>
						Delete transaction
					</Dialog.Title>
					<Dialog.Content>
						<Text style={{ fontFamily: 'Inter-Regular' }} variant="bodyMedium">
							This action cannot be undone.
						</Text>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={closeDialog}
							disabled={loading}
							labelStyle={{ fontFamily: 'Inter-Regular' }}
						>
							Cancel
						</Button>

						<Button
							onPress={deleteTransaction}
							disabled={loading}
							labelStyle={{ fontFamily: 'Inter-Regular' }}
						>
							{loading ? 'Deleting' : 'I understand'}
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<Button onPress={openDialog}>
				<Trash2 strokeWidth={1.5} color={theme.colors.onBackground} size={20} />
			</Button>
		</>
	);
}

