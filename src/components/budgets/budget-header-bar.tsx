import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Trash2Icon, XIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

import * as schema from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { fastSpatialEasing } from '@/utils/utils';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';
import { useSelectedBudgets } from '@/store/useSelectedBudgets';

export default function BudgetTransactionHeaderBar() {
	const drizzleDb = useDrizzleDB();

	const [deleting, setDeleting] = useState<boolean>(false);
	const { selectedBudgets, setSelectedBudgets } = useSelectedBudgets();

	const handleDelete = useCallback(async () => {
		try {
			setDeleting(true);

			await drizzleDb
				.delete(schema.budgets)
				.where(inArray(schema.budgets.id, selectedBudgets));
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setDeleting(false);
			setSelectedBudgets([]);
		}
	}, [selectedBudgets]);

	const buttonRenderer = useCallback(() => {
		if (selectedBudgets.length)
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
						onPress={() => setSelectedBudgets([])}
						icon={(props) => (
							<XIcon size={20} color={props.color} strokeWidth={1.5} />
						)}
					>
						{selectedBudgets.length}
					</Button>
				</Animated.View>
			);

		return <></>;
	}, [selectedBudgets]);

	useFocusEffect(
		useCallback(() => {
			return () => {
				setSelectedBudgets([]);
			};
		}, [])
	);

	return (
		<View style={styles.TransactionHeaderBar}>
			<Text variant="titleLarge" style={styles.transactionsTitle}>
				Budgets
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
		marginBottom: 12,
		paddingHorizontal: 16,
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

