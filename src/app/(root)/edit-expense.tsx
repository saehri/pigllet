import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Calculator } from 'lucide-react-native';
import { Button, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import EditExpenseForm from '@/src/components/forms/expense/edit-expense-form';
import DeleteTransactionsDialog from '@/src/components/reusables/delete-transactions-dialog';

export default function ExpenseDetail() {
	const theme = useTheme();
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
					<Button
						mode="contained-tonal"
						style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}
					>
						<Calculator
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
							size={20}
						/>
					</Button>

					<DeleteTransactionsDialog
						transactionType="expense"
						transactionId={Number(id)}
					/>
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

