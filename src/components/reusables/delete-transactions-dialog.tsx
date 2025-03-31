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

			// delete the transactions
			await drizzleDb
				.delete(schema.transactions)
				.where(eq(schema.transactions.id, transactionId));

			let newBalance = 0;
			if (transaction[0].type === 'expense') {
				newBalance = account[0].balance + transaction[0].amount;
			} else {
				newBalance = account[0].balance - transaction[0].amount;
			}

			await drizzleDb.update(schema.accounts).set({
				balance: newBalance,
			});

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
					<Dialog.Title>Delete transaction</Dialog.Title>
					<Dialog.Content>
						<Text style={{ fontFamily: 'Inter-Regular' }} variant="bodyLarge">
							This action cannot be undone.
						</Text>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={closeDialog}
							disabled={loading}
							labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
						>
							Cancel
						</Button>

						<Button
							onPress={deleteTransaction}
							disabled={loading}
							labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
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
