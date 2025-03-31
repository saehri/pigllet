import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Button, useTheme } from 'react-native-paper';
import { Calculator } from 'lucide-react-native';

import DeleteTransactionsDialog from '@/src/components/reusables/delete-transactions-dialog';
import EditIncomeForm from '@/src/components/forms/income/edit-income-form';

export default function IncomeDetail() {
	const theme = useTheme();
	const navigation = useNavigation();
	const { id } = useLocalSearchParams();

	useEffect(() => {
		navigation.setOptions({
			title: '',
			headerRight: () => (
				<View
					style={{
						backgroundColor: theme.colors.background,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Button>
						<Calculator
							strokeWidth={1.5}
							color={theme.colors.onBackground}
							size={20}
						/>
					</Button>

					<DeleteTransactionsDialog transactionId={Number(id)} />
				</View>
			),
		});
	}, []);

	return (
		<ScrollView style={{ backgroundColor: theme.colors.background }}>
			<EditIncomeForm />
		</ScrollView>
	);
}
