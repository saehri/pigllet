import { useCallback, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { Trash2Icon, XIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

import * as schema from '@/db/schema';
import { eq, inArray, or } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSelectedTransactions } from '@/store/useSelectedTransactions';

import { fastSpatialEasing } from '@/utils/utils';

export default function HeaderBar() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [deleting, setDeleting] = useState<boolean>(false);

	const selectedTransactions = useSelectedTransactions(
		(s) => s.selectedTransactions
	);
	const setSelectedTransactions = useSelectedTransactions(
		(s) => s.setSelectedTransactions
	);

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

	return (
		<View style={styles.headerBar}>
			<Text variant="titleLarge" style={styles.transactionsTitle}>
				Transactions
			</Text>

			{selectedTransactions.length ? (
				<Animated.View
					entering={FadeInRight.duration(500).easing(fastSpatialEasing)}
					exiting={FadeOutRight.duration(200).easing(fastSpatialEasing)}
					style={styles.actionButtons}
				>
					<Button
						style={styles.actionButton}
						mode="contained-tonal"
						icon={(props) => (
							<Trash2Icon size={20} color={props.color} strokeWidth={1.5} />
						)}
						labelStyle={styles.buttonLabel}
						onPress={handleDelete}
						loading={deleting}
					>
						Delete
					</Button>
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
			) : (
				<View></View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	headerBar: {
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

