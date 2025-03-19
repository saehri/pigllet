import { useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';

import NewExpenseForm from '@/src/components/reusables/new-expense-form';

export default function NewExpense() {
	const theme = useTheme();

	return (
		<ScrollView style={{ backgroundColor: theme.colors.background }}>
			<NewExpenseForm />
		</ScrollView>
	);
}
