import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Stack
			initialRouteName="(tabs)"
			screenOptions={{
				statusBarBackgroundColor: theme.colors.background,
				statusBarTranslucent: false,
				contentStyle: {
					backgroundColor: theme.colors.background,
				},
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
					statusBarStyle: 'dark',
					statusBarTranslucent: true,
				}}
			/>
			<Stack.Screen
				name="settings"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="new-transactions"
				options={{
					title: 'New transaction',
					headerTintColor: theme.colors.onBackground,
					headerStyle: { backgroundColor: theme.colors.background },
					headerTitleStyle: {
						fontFamily: 'Inter-Black',
						fontSize: 20,
					},
				}}
			/>
		</Stack>
	);
}
