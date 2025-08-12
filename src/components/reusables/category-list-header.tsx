import { Button } from 'react-native-paper';
import { memo, useCallback, useState } from 'react';
import { Trash2Icon, XIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { useSelectedCategory } from '@/store/useSelectedCategory';

import * as schema from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

type Props = {
	defaultCategoryLabel: string;
};

function CategoryListHeader({ defaultCategoryLabel }: Props) {
	const { selectedCategories, setSelectedCategories } = useSelectedCategory();
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [deleting, setDeleting] = useState<boolean>(false);

	const handleDelete = useCallback(async () => {
		try {
			setDeleting(true);

			const defaultCategory = await drizzleDb
				.select({
					defaultCategoryId: schema.categories.id,
				})
				.from(schema.categories)
				.where(eq(schema.categories.label, defaultCategoryLabel));

			const defaultCategoryId = defaultCategory[0]?.defaultCategoryId;

			if (defaultCategoryId) {
				await drizzleDb
					.update(schema.transactions)
					.set({
						category_id: defaultCategoryId,
					})
					.where(inArray(schema.transactions.category_id, selectedCategories));

				await drizzleDb
					.delete(schema.categories)
					.where(inArray(schema.categories.id, selectedCategories));
			}
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setDeleting(false);
			setSelectedCategories([]);
		}
	}, [selectedCategories]);

	return (
		<View style={styles.headerBar}>
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
	headerBar: {
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

