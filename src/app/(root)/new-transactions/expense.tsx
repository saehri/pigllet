import { useTheme } from 'react-native-paper';
import { ScrollView, View } from 'react-native';

import NewExpenseForm from '@/src/components/forms/expense/new-expense-form';

export default function NewExpense() {
	const theme = useTheme();

	return (
		<ScrollView style={{ backgroundColor: theme.colors.background }}>
			<View style={{ paddingTop: 59 }}>
				<NewExpenseForm />
			</View>
		</ScrollView>
	);
}
