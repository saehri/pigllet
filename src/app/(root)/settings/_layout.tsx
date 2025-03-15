import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Stack
			initialRouteName="index"
			screenOptions={{
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
		>
			<Stack.Screen
				name="index"
				options={{
					title: 'Settings',
				}}
			/>
			<Stack.Screen
				name="account"
				options={{
					title: 'Account',
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
			<Stack.Screen
				name="wallets"
				options={{
					title: 'Wallet',
				}}
			/>
		</Stack>
	);
}
