import { Workflow } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function IncomeCategories() {
	const theme = useTheme();

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					padding: 16,
				}}
			></View>
		</ScrollView>
	);
}

