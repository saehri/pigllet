import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Stack
			initialRouteName="index"
			screenOptions={{
				statusBarBackgroundColor: theme.colors.background,
				headerTintColor: theme.colors.onBackground,
				headerShadowVisible: false,
				statusBarStyle: 'dark',
				headerStyle: {
					backgroundColor: theme.colors.background,
				},
				headerTitleStyle: {
					fontFamily: 'Inter-Regular',
					fontSize: 20,
				},
				contentStyle: {
					backgroundColor: theme.colors.background,
				},
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: 'Settings',
				}}
			/>
			<Stack.Screen
				name="user"
				options={{
					title: 'User',
				}}
			/>
			<Stack.Screen
				name="customization"
				options={{
					title: 'Customizations',
				}}
			/>
			<Stack.Screen
				name="currency"
				options={{
					title: 'Currency',
				}}
			/>
			<Stack.Screen
				name="security"
				options={{
					title: 'Security',
				}}
			/>
			<Stack.Screen
				name="transaction-categories"
				options={{
					title: 'Transaction category',
				}}
			/>
			<Stack.Screen name="accounts" options={{ headerShown: false }} />
		</Stack>
	);
}
