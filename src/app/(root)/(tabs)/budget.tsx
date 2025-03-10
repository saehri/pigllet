import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import BudgetCard from '@/src/components/budgets/budget-card';

export default function BudgetScreen() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				paddingHorizontal: 16,
			}}
		>
			<View style={{ gap: 10 }}>
				<BudgetCard />
			</View>
		</ScrollView>
	);
}
