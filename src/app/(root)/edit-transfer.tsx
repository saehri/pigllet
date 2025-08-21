import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { CalculatorIcon } from 'lucide-react-native';
import { Button, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import EditTransferForm from '@/src/components/forms/transfer/edit-transfer-form';
import DeleteTransactionsDialog from '@/src/components/reusables/delete-transactions-dialog';

export default function NewTransferForm() {
	const theme = useTheme();
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
					<Button
						mode="contained-tonal"
						style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}
					>
						<CalculatorIcon
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
							size={20}
						/>
					</Button>

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

