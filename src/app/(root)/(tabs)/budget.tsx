import { ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function BudgetScreen() {
	const theme = useTheme()

	return (
		<ScrollView style={{ backgroundColor: theme.colors.background }}>
			<Text>Hello from home wallet</Text>
		</ScrollView>
	);
}
