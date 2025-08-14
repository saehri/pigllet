import { ScrollView } from 'react-native';

import CreateIncomeForm from '@/src/components/forms/income/new-income-form';

export default function NewIncome() {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingTop: 60 }}
		>
			<CreateIncomeForm />
		</ScrollView>
	);
}

