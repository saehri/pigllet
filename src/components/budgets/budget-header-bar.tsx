import { useCallback, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { Trash2Icon, XIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

import * as schema from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { fastSpatialEasing } from '@/utils/utils';
import { useSelectedBudgets } from '@/store/useSelectedBudgets';
import { useFocusEffect } from 'expo-router';

export default function BudgetHeaderBar() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

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
		<View style={styles.headerBar}>
			<Text variant="titleLarge" style={styles.transactionsTitle}>
				Budgets
			</Text>

			{buttonRenderer()}
		</View>
	);
}

const styles = StyleSheet.create({
	headerBar: {
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

