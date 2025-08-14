import { ScrollView } from 'react-native';

import NewExpenseForm from '@/src/components/forms/expense/new-expense-form';

export default function NewExpense() {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingTop: 60 }}
		>
			<NewExpenseForm />
		</ScrollView>
	);
}

