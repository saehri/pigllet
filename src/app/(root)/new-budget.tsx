import { useTheme } from 'react-native-paper';
import { ScrollView, View } from 'react-native';

import NewBudgetForm from '@/src/components/forms/budget/new-budget-form';

export default function NewBudget() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background }}
			showsVerticalScrollIndicator={false}
		>
			<View>
				<NewBudgetForm />
			</View>
		</ScrollView>
	);
}

