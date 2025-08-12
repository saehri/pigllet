import { useCallback, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { Trash2Icon, XIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite';
import { useSelectedTransactions } from '@/store/useSelectedTransactions';
import { deleteTransactions } from '@/src/hooks/useTransactionsManager';

import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

export default function HeaderBar() {
	const db = useSQLiteContext();

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

			for (const selectedId of selectedTransactions) {
				await deleteTransactions(db, selectedId);
			}
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

