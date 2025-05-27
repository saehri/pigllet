import { useTheme } from 'react-native-paper';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import EditBudgetForm from '@/src/components/forms/budget/edit-budget-form';
import DeleteBudgetDialog from '@/src/components/reusables/delete-budget-dialog';

export default function EditBudget() {
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
					<DeleteBudgetDialog budgetId={Number(id)} />
				</View>
			),
		});
	}, []);

	return (
		<ScrollView style={{ backgroundColor: theme.colors.background }}>
			<EditBudgetForm budgetId={Number(id)} />
		</ScrollView>
	);
}

