import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Trash2Icon, XIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { useSelectedCategory } from '@/store/useSelectedCategory';

import * as schema from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

function CategoryListHeader() {
	const { selectedCategories, setSelectedCategories } = useSelectedCategory();
	const drizzleDb = useDrizzleDB();

	const [deleting, setDeleting] = useState<boolean>(false);

	const handleDelete = useCallback(async () => {
		try {
			setDeleting(true);

			await drizzleDb.transaction(async (tx) => {
				const categorySample = await tx
					.select({ type: schema.categories.type })
					.from(schema.categories)
					.where(eq(schema.categories.id, selectedCategories[0]));

				const initialCategoryLabel = () => {
					const { type } = categorySample[0];

					if (type === 'expense') return 'Other Expense';
					if (type === 'income') return 'Other Income';
					return 'Other Transfer';
				};

				// Get the default category ID
				const initialCategory = await tx
					.select({
						id: schema.categories.id,
						type: schema.categories.type,
					})
					.from(schema.categories)
					.where(eq(schema.categories.label, initialCategoryLabel()));

				const { id: initialCategoryId } = initialCategory[0];

				// Step 1 — Update transactions before deleting categories
				await tx
					.update(schema.transactions)
					.set({ category_id: initialCategoryId })
					.where(inArray(schema.transactions.category_id, selectedCategories));

				// Step 2 — Delete only non default categories
				await tx
					.delete(schema.categories)
					.where(
						and(
							inArray(schema.categories.id, selectedCategories),
							eq(schema.categories.is_default, 0)
						)
					);
			});
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setDeleting(false);
			setSelectedCategories([]);
		}
	}, [selectedCategories]);

	useFocusEffect(
		useCallback(() => {
			return () => {
				setSelectedCategories([]);
			};
		}, [])
	);

	return (
		<View style={styles.TransactionHeaderBar}>
			{selectedCategories.length ? (
				<Animated.View
					entering={FadeInRight.duration(350).mass(10)}
					style={styles.actionButtons}
				>
					<DeleteModal handleDelete={handleDelete} loading={deleting} />
					<Button
						style={styles.actionButton}
						mode="contained-tonal"
						labelStyle={styles.buttonLabel}
						onPress={() => setSelectedCategories([])}
						icon={(props) => (
							<XIcon size={20} color={props.color} strokeWidth={1.5} />
						)}
					>
						{selectedCategories.length}
					</Button>
				</Animated.View>
			) : (
				<View></View>
			)}
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
							The selected category permanently deleted and all transactions
							with this category will be reverted to its original category.
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

export default memo(CategoryListHeader);

const styles = StyleSheet.create({
	TransactionHeaderBar: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
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

