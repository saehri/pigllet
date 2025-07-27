import { useState } from 'react';
import { Trash2Icon } from 'lucide-react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';

import useTransactionsManager from '@/src/hooks/useTransactionsManager';

type Props = {
	transactionId: number;
	transactionType: schema.TransactionType;
};

export default function DeleteTransactionsDialog({
	transactionId,
	transactionType,
}: Props) {
	const theme = useTheme();

	const [visible, setVisible] = useState<boolean>(false);

	const openDialog = () => setVisible(true);
	const closeDialog = () => setVisible(false);

	const { deleteTransaction, loading } = useTransactionsManager({
		transactionType,
		transactionId,
		actionType: 'delete',
	});

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={closeDialog}>
					<Dialog.Title style={{ fontFamily: 'Manrope-Regular' }}>
						Delete transaction
					</Dialog.Title>
					<Dialog.Content>
						<Text
							style={{ fontFamily: 'Manrope-Regular' }}
							variant="bodyMedium"
						>
							This action cannot be undone.
						</Text>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={closeDialog}
							disabled={loading}
							labelStyle={{ fontFamily: 'Manrope-Regular' }}
						>
							Cancel
						</Button>

						<Button
							onPress={deleteTransaction}
							disabled={loading}
							labelStyle={{ fontFamily: 'Manrope-Regular' }}
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

