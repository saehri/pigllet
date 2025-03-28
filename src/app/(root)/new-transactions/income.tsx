import { useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';

import CreateIncomeForm from '@/src/components/forms/income/new-income-form';

export default function NewIncome() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background, paddingTop: 59 }}
		>
			<CreateIncomeForm />
		</ScrollView>
	);
}
