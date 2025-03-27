import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: theme.colors.background },
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen name="welcome" options={{ headerShown: false }} />
			<Stack.Screen
				name="wallet-setup"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen name="sign-up" options={{ headerShown: false }} />
			<Stack.Screen name="sign-in" options={{ headerShown: false }} />
		</Stack>
	);
}
