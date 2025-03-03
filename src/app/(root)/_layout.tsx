import { Stack, } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Stack
			initialRouteName="(tabs)"
			screenOptions={{
				animation: 'ios_from_right',
				animationDuration: 400,
				contentStyle: {
					backgroundColor: theme.colors.background,
				},
			}}
		>
			<Stack.Screen name="(tabs)" options={{ headerShown: false, statusBarStyle: 'dark', statusBarColor: theme.colors.background }} />
			<Stack.Screen
				name="settings"
				options={{
					headerTintColor: theme.colors.onBackground,
					statusBarColor: theme.colors.background,
					headerShadowVisible: false,
					statusBarStyle: 'dark',
					headerStyle: {
						backgroundColor: theme.colors.background,
					},
					headerTitle: (props) => (
						<Text variant="titleLarge" style={{ fontFamily: 'Inter-Black' }}>
							Settings
						</Text>
					),
				}}
			/>
		</Stack>
	);
}
