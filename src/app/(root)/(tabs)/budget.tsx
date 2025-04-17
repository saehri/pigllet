import { ScrollView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { Workflow } from 'lucide-react-native';
import BudgetCard from '@/src/components/budgets/budget-card';

export default function BudgetScreen() {
	const theme = useTheme();

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			<View style={{ padding: 16 }}>
				<BudgetCard />
			</View>
		</ScrollView>
	);
}
