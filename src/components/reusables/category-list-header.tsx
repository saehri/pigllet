import { Button } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Trash2Icon, XIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { useSelectedCategory } from '@/store/useSelectedCategory';

import * as schema from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

type Props = {
	defaultCategoryLabel: string;
};

function CategoryListHeader({ defaultCategoryLabel }: Props) {
	const { selectedCategories, setSelectedCategories } = useSelectedCategory();
	const drizzleDb = useDrizzleDB();

	const [deleting, setDeleting] = useState<boolean>(false);

	const handleDelete = useCallback(async () => {
		try {
			setDeleting(true);

			// Get the default category ID
			const initialCategory = await drizzleDb
				.select({
					id: schema.categories.id,
					type: schema.categories.type,
				})
				.from(schema.categories)
				.where(eq(schema.categories.label, defaultCategoryLabel));

			const { id: initialCategoryId, type: initialCategoryType } =
				initialCategory[0];

			if (initialCategoryId) {
				// Step 1 — Get selected categories that are NOT default
				const nonDefaultCategories = await drizzleDb
					.select({ id: schema.categories.id })
					.from(schema.categories)
					.where(
						and(
							eq(schema.categories.is_default, 0),
							eq(schema.categories.type, initialCategoryType),
							inArray(schema.categories.id, selectedCategories)
						)
					);

				const nonDefaultCatIds = nonDefaultCategories.map((c) => c.id);

				if (nonDefaultCatIds.length > 0) {
					// Step 2 — Update transactions before deleting categories
					await drizzleDb
						.update(schema.transactions)
						.set({ category_id: initialCategoryId })
						.where(inArray(schema.transactions.category_id, nonDefaultCatIds));

					// Step 3 — Delete only non default categories
					await drizzleDb
						.delete(schema.categories)
						.where(
							and(
								inArray(schema.categories.id, selectedCategories),
								eq(schema.categories.is_default, 0)
							)
						);
				}
			}
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

export default memo(CategoryListHeader);

const styles = StyleSheet.create({
	TransactionHeaderBar: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginBottom: 16,
		marginTop: 4,
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

