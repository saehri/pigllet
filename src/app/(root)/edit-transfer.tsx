import { useEffect } from 'react';
import { Button, useTheme } from 'react-native-paper';
import { CalculatorIcon } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import EditTransferForm from '@/src/components/forms/transfer/edit-transfer-form';
import DeleteTransactionsDialog from '@/src/components/reusables/delete-transactions-dialog';

export default function NewTransferForm() {
	const theme = useTheme();
	const navigation = useNavigation();
	const { id } = useLocalSearchParams();

	useEffect(() => {
		navigation.setOptions({
			title: '',
			headerRight: () => (
				<View
					style={[
						styles.headerRightContainer,
						{ backgroundColor: theme.colors.background },
					]}
				>
					<Button>
						<CalculatorIcon
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
			<EditTransferForm />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	headerRightContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

