import { useTheme } from 'react-native-paper';
import { ScrollView, View } from 'react-native';

import CreateIncomeForm from '@/src/components/forms/income/new-income-form';

export default function NewIncome() {
	const theme = useTheme();

	return (
		<ScrollView style={{ backgroundColor: theme.colors.background }}>
			<View style={{ paddingTop: 59 }}>
				<CreateIncomeForm />
			</View>
		</ScrollView>
	);
}
