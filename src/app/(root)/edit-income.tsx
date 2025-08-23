import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import EditIncomeForm from '@/src/components/forms/income/edit-income-form';
import DeleteTransactionsDialog from '@/src/components/reusables/delete-transactions-dialog';

export default function IncomeDetail() {
	const navigation = useNavigation();
	const { id } = useLocalSearchParams();

	useEffect(() => {
		navigation.setOptions({
			title: 'Edit income',
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
			<EditIncomeForm />
		</ScrollView>
	);
}

