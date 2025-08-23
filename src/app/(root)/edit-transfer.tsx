import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import EditTransferForm from '@/src/components/forms/transfer/edit-transfer-form';
import DeleteTransactionsDialog from '@/src/components/reusables/delete-transactions-dialog';

export default function NewTransferForm() {
	const navigation = useNavigation();
	const { id } = useLocalSearchParams();

	useEffect(() => {
		navigation.setOptions({
			title: 'Edit transfer',
			headerRight: () => (
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						gap: 2,
					}}
				>
					<DeleteTransactionsDialog transactionId={Number(id)} />
				</View>
			),
		});
	}, []);

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<EditTransferForm />
		</ScrollView>
	);
}

