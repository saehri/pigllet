import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
	const theme = useTheme();

	return (
		<SafeAreaView style={{ backgroundColor: theme.colors.background }}>
			<Text>Hello from auth screen</Text>
		</SafeAreaView>
	);
}
