import { useCallback, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { Trash2Icon, XIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

import { useSQLiteContext } from 'expo-sqlite';

import { deleteBudgetRecord } from '@/src/hooks/useBudgetManager';
import { useSelectedBudgets } from '@/store/useSelectedBudgets';

export default function BudgetHeaderBar() {
	const db = useSQLiteContext();

	const [deleting, setDeleting] = useState<boolean>(false);

	const { selectedBudgets, setSelectedBudgets } = useSelectedBudgets();

	const handleDelete = useCallback(async () => {
		try {
			setDeleting(true);

			deleteBudgetRecord(selectedBudgets, db);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setDeleting(false);
			setSelectedBudgets([]);
		}
	}, [selectedBudgets]);

	return (
		<View style={styles.headerBar}>
			<Text variant="titleLarge" style={styles.transactionsTitle}>
				Budgets
			</Text>

			{selectedBudgets.length ? (
				<Animated.View
					entering={FadeInRight.duration(350).mass(10)}
					exiting={FadeOutRight.duration(350).mass(10)}
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

