import { useEffect, useState } from 'react';
import { Trash2Icon } from 'lucide-react-native';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Button, Dialog, Portal, useTheme } from 'react-native-paper';

import useBudgetManager from '@/src/hooks/useBudgetManager';
import EditBudgetForm from '@/src/components/forms/budget/edit-budget-form';

export default function EditBudget() {
	const navigation = useNavigation();
	const { id } = useLocalSearchParams();

	useEffect(() => {
		navigation.setOptions({
			title: 'Edit budget',
			headerRight: () => <DeleteBudgetDialog budgetId={Number(id)} />,
		});
	}, []);

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<EditBudgetForm budgetId={Number(id)} />
		</ScrollView>
	);
}

type DeleteBudgetDialog = { budgetId: number };

function DeleteBudgetDialog({ budgetId }: DeleteBudgetDialog) {
	const theme = useTheme();

	const [visible, setVisible] = useState<boolean>(false);

	const openDialog = () => setVisible(true);
	const closeDialog = () => setVisible(false);

	const { loading, deleteBudgetRecord } = useBudgetManager({
		actionType: 'delete',
		budgetId,
	});

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={closeDialog}>
					<Dialog.Icon
						icon={(props) => (
							<Trash2Icon
								color={props.color}
								size={props.size}
								strokeWidth={1.5}
							/>
						)}
					/>
					<Dialog.Title style={styles.dialogTitleStyle}>
						Delete budget record
					</Dialog.Title>

					<Dialog.Actions>
						<Button
							onPress={closeDialog}
							disabled={loading}
							labelStyle={styles.dialogContentTextStyle}
						>
							Cancel
						</Button>

						<Button
							labelStyle={styles.dialogContentTextStyle}
							onPress={deleteBudgetRecord}
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
				style={{ height: 40 }}
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

const styles = StyleSheet.create({
	dialogContentTextStyle: {
		fontFamily: 'Manrope-Regular',
		fontSize: 16,
	},
	dialogTitleStyle: {
		fontFamily: 'Manrope-Regular',
		textAlign: 'center',
	},
});

