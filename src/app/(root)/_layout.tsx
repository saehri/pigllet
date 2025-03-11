import { Stack, useRouter } from 'expo-router';
import { Plus, Settings } from 'lucide-react-native';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();
	const router = useRouter();

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
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
					statusBarStyle: 'dark',
					statusBarColor: theme.colors.background,
					statusBarTranslucent: true,
				}}
			/>
			<Stack.Screen
				name="settings"
				options={{
					title: 'Settings',
					headerTintColor: theme.colors.onBackground,
					statusBarColor: theme.colors.background,
					headerShadowVisible: false,
					statusBarStyle: 'dark',
					statusBarTranslucent: true,
					headerStyle: {
						backgroundColor: theme.colors.background,
					},
					headerTitleStyle: {
						fontFamily: 'Inter-Black',
						fontSize: 20,
					},
				}}
			/>
			<Stack.Screen
				name="new-transactions"
				options={{
					title: 'New transaction',
					headerTintColor: theme.colors.onBackground,
					headerStyle: { backgroundColor: theme.colors.background },
					statusBarColor: theme.colors.background,
					headerShadowVisible: false,
					statusBarStyle: 'dark',
					statusBarTranslucent: true,
					headerTitleStyle: {
						fontFamily: 'Inter-Black',
						fontSize: 20,
					},
				}}
			/>
		</Stack>
	);
}
