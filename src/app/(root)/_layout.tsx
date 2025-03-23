import { Stack } from 'expo-router';
import { Calculator } from 'lucide-react-native';
import { View } from 'react-native';
import { useTheme, Button, Text } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Stack
			initialRouteName="(tabs)"
			screenOptions={{
				statusBarBackgroundColor: theme.colors.background,
				contentStyle: {
					backgroundColor: theme.colors.background,
				},
				headerShadowVisible: false,
				headerTintColor: theme.colors.onBackground,
				headerTitleStyle: {
					fontFamily: 'Inter-Black',
					fontSize: 20,
				},
				headerStyle: { backgroundColor: theme.colors.background },
			}}
		>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
					statusBarStyle: 'dark',
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
					headerRight: (props) => (
						<View
							style={{
								backgroundColor: theme.colors.background,
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Button>
								<Calculator
									strokeWidth={1.5}
									color={theme.colors.onBackground}
									size={24}
								/>
							</Button>
						</View>
					),
				}}
			/>
			<Stack.Screen
				name="expense-detail/[id]"
				options={{
					title: 'Expense detail',
				}}
			/>
		</Stack>
	);
}
