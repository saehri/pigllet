import { ScrollView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function Currency() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background, padding: 16 }}
		>
			<Text>Currency</Text>
		</ScrollView>
	);
}
