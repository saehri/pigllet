import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Trash2Icon, XIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

import { fastSpatialEasing } from '@/utils/utils';

import * as schema from '@/db/schema';
import { eq, inArray, or } from 'drizzle-orm';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';
import { useSelectedTransactions } from '@/store/useSelectedTransactions';

export default function TransactionHeaderBar() {
	const drizzleDb = useDrizzleDB();

	const [deleting, setDeleting] = useState<boolean>(false);

	const { selectedTransactions, setSelectedTransactions } =
		useSelectedTransactions();

	const handleDelete = useCallback(async () => {
		try {
			setDeleting(true);

			// 1. Get all selected transactions before deleting them
			const transactionsToDelete = await drizzleDb
				.select({
					id: schema.transactions.id,
					type: schema.transactions.type,
					amount: schema.transactions.amount,
					accountId: schema.transactions.account_id,
					relatedAccountId: schema.transactions.related_account_id,
				})
				.from(schema.transactions)
				.where(inArray(schema.transactions.id, selectedTransactions));

			// 2. Get all affected account IDs
			const affectedAccountIds = new Set<number>();
			for (const t of transactionsToDelete) {
				if (t.accountId) affectedAccountIds.add(t.accountId);
				if (t.relatedAccountId) affectedAccountIds.add(t.relatedAccountId);
			}

			// 3. Delete all selected transactions at once
			await drizzleDb
				.delete(schema.transactions)
				.where(inArray(schema.transactions.id, selectedTransactions));

			// 4. Recalculate balances for affected accounts
			for (const accountId of affectedAccountIds) {
				const remainingTransactions = await drizzleDb
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
				await drizzleDb
					.update(schema.accounts)
					.set({ balance })
					.where(eq(schema.accounts.id, accountId));
			}

			ToastAndroid.show('Transactions deleted!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setDeleting(false);
			setSelectedTransactions([]);
		}
	}, [selectedTransactions]);

	useFocusEffect(
		useCallback(() => {
			return () => {
				setSelectedTransactions([]);
			};
		}, [])
	);

	const buttonRenderer = useCallback(() => {
		if (selectedTransactions.length)
			return (
				<Animated.View
					entering={FadeInRight.duration(500).easing(fastSpatialEasing)}
					exiting={FadeOutRight.duration(200).easing(fastSpatialEasing)}
					style={styles.actionButtons}
				>
					<DeleteModal handleDelete={handleDelete} loading={deleting} />

					<Button
						style={styles.actionButton}
						mode="contained-tonal"
						labelStyle={styles.buttonLabel}
						onPress={() => setSelectedTransactions([])}
						icon={(props) => (
							<XIcon size={20} color={props.color} strokeWidth={1.5} />
						)}
					>
						{selectedTransactions.length}
					</Button>
				</Animated.View>
			);

		return <></>;
	}, [selectedTransactions]);

	return (
		<View style={styles.TransactionHeaderBar}>
			<Text variant="titleLarge" style={styles.transactionsTitle}>
				Transactions
			</Text>

			{buttonRenderer()}
		</View>
	);
}

type DeleteModalProps = {
	handleDelete: () => void;
	loading: boolean;
};

function DeleteModal({ handleDelete, loading }: DeleteModalProps) {
	const [open, setOpen] = useState(false);

	const openDialog = () => setOpen(true);
	const closeDialog = () => setOpen(false);

	return (
		<>
			<Button
				style={styles.actionButton}
				mode="contained-tonal"
				icon={(props) => (
					<Trash2Icon size={20} color={props.color} strokeWidth={1.5} />
				)}
				labelStyle={styles.buttonLabel}
				onPress={openDialog}
			>
				Delete
			</Button>

			<Portal>
				<Dialog visible={open} onDismiss={closeDialog}>
					<Dialog.Icon
						icon={(props) => (
							<Trash2Icon
								color={props.color}
								size={props.size}
								strokeWidth={1.5}
							/>
						)}
					/>

					<Dialog.Title
						style={{ fontFamily: 'Manrope-Regular', textAlign: 'center' }}
					>
						Are you sure?
					</Dialog.Title>

					<Dialog.Content>
						<Text variant="bodyLarge" style={{ fontFamily: 'Manrope-Regular' }}>
							The selected transaction records will be permanently deleted.
						</Text>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							labelStyle={{ fontFamily: 'Manrope-Regular', fontSize: 16 }}
							onPress={closeDialog}
						>
							Cancel
						</Button>

						<Button
							labelStyle={{ fontFamily: 'Manrope-Regular', fontSize: 16 }}
							onPress={() => {
								closeDialog();
								handleDelete();
							}}
							disabled={loading}
							loading={loading}
						>
							Delete
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
}

const styles = StyleSheet.create({
	TransactionHeaderBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 16,
		marginBottom: 4,
		height: 40,
	},
	transactionsTitle: {
		fontFamily: 'Manrope-Regular',
	},
	actionButtons: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
	},
	actionButton: {
		height: 40,
	},
	buttonLabel: {
		fontFamily: 'Manrope-Regular',
	},
});

