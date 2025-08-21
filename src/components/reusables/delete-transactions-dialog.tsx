import { useRouter } from 'expo-router';
import { ToastAndroid } from 'react-native';
import { useCallback, useState } from 'react';
import { Trash2Icon } from 'lucide-react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

import { eq, or } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

type Props = {
	transactionId: number;
};

export default function DeleteTransactionsDialog({ transactionId }: Props) {
	const theme = useTheme();
	const router = useRouter();
	const drizzleDb = useDrizzleDB();

	const [visible, setVisible] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const openDialog = () => setVisible(true);
	const closeDialog = () => setVisible(false);

	const handleDelete = useCallback(async () => {
		try {
			setLoading(true);

			await drizzleDb.transaction(async (tx) => {
				// 1. Get all selected transactions before deleting them
				const transactionsToDelete = await tx
					.select({
						id: schema.transactions.id,
						type: schema.transactions.type,
						amount: schema.transactions.amount,
						accountId: schema.transactions.account_id,
						relatedAccountId: schema.transactions.related_account_id,
					})
					.from(schema.transactions)
					.where(eq(schema.transactions.id, transactionId));

				// 2. Get all affected account IDs
				const affectedAccountIds = new Set<number>();
				for (const t of transactionsToDelete) {
					if (t.accountId) affectedAccountIds.add(t.accountId);
					if (t.relatedAccountId) affectedAccountIds.add(t.relatedAccountId);
				}

				// 3. Delete all selected transactions at once
				await tx
					.delete(schema.transactions)
					.where(eq(schema.transactions.id, transactionId));

				// 4. Recalculate balances for affected accounts
				for (const accountId of affectedAccountIds) {
					const remainingTransactions = await tx
						.select({
							type: schema.transactions.type,
							amount: schema.transactions.amount,
							accountId: schema.transactions.account_id,
							relatedAccountId: schema.transactions.related_account_id,
						})
						.from(schema.transactions)
						.where(
							or(
								eq(schema.transactions.account_id, accountId),
								eq(schema.transactions.related_account_id, accountId)
							)
						);

					let balance = 0;

					for (const t of remainingTransactions) {
						if (t.type === 'income' && t.accountId === accountId) {
							balance += t.amount;
						} else if (t.type === 'expense' && t.accountId === accountId) {
							balance -= t.amount;
						} else if (t.type === 'transfer') {
							if (t.accountId === accountId) {
								balance -= t.amount; // sent out
							} else if (t.relatedAccountId === accountId) {
								balance += t.amount; // received
							}
						}
					}

					// 5. Update the account with the new balance
					await tx
						.update(schema.accounts)
						.set({ balance })
						.where(eq(schema.accounts.id, accountId));
				}
			});

			ToastAndroid.show('Transactions deleted!', ToastAndroid.SHORT);
			router.back();
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}, [transactionId]);

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={closeDialog}>
					<Dialog.Title style={{ fontFamily: 'Manrope-Regular' }}>
						Delete transaction
					</Dialog.Title>
					<Dialog.Content>
						<Text
							style={{ fontFamily: 'Manrope-Regular' }}
							variant="bodyMedium"
						>
							This action cannot be undone.
						</Text>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={closeDialog}
							disabled={loading}
							labelStyle={{ fontFamily: 'Manrope-Regular' }}
						>
							Cancel
						</Button>

						<Button
							labelStyle={{ fontFamily: 'Manrope-Regular' }}
							onPress={handleDelete}
							disabled={loading}
							loading={loading}
						>
							Delete
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<Button
				onPress={openDialog}
				mode="contained-tonal"
				style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
			>
				<Trash2Icon
					strokeWidth={1.5}
					color={theme.colors.onSecondaryContainer}
					size={20}
				/>
			</Button>
		</>
	);
}

