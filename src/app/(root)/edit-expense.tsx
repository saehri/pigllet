import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import EditExpenseForm from '@/src/components/forms/expense/edit-expense-form';
import DeleteTransactionsDialog from '@/src/components/reusables/delete-transactions-dialog';

export default function ExpenseDetail() {
	const navigation = useNavigation();
	const { id } = useLocalSearchParams();

	useEffect(() => {
		navigation.setOptions({
			title: 'Edit expense',
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
			<EditExpenseForm />
		</ScrollView>
	);
}

