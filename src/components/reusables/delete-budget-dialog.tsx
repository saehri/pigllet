import { useState } from 'react';
import { Trash2Icon } from 'lucide-react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

import useBudgetManager from '@/src/hooks/useBudgetManager';

type Props = { budgetId: number };

export default function DeleteBudgetDialog({ budgetId }: Props) {
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
					<Dialog.Title style={{ fontFamily: 'Inter-Regular' }}>
						Delete budget record
					</Dialog.Title>
					<Dialog.Content>
						<Text style={{ fontFamily: 'Inter-Regular' }} variant="bodyMedium">
							This action cannot be undone.
						</Text>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={closeDialog}
							disabled={loading}
							labelStyle={{ fontFamily: 'Inter-Regular' }}
						>
							Cancel
						</Button>

						<Button
							onPress={deleteBudgetRecord}
							disabled={loading}
							labelStyle={{ fontFamily: 'Inter-Regular' }}
						>
							{loading ? 'Deleting' : 'I understand'}
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<Button onPress={openDialog}>
				<Trash2Icon
					strokeWidth={1.5}
					color={theme.colors.onBackground}
					size={20}
				/>
			</Button>
		</>
	);
}

