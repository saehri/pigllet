import { Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
	const theme = useTheme();

	return (
		<SafeAreaView
			style={{
				backgroundColor: theme.colors.background,
				minHeight: Dimensions.get('screen').height,
			}}
		>
			<Text>Hello from auth screen</Text>
		</SafeAreaView>
	);
}
