import { Stack } from 'expo-router';
import { Calculator } from 'lucide-react-native';
import { View } from 'react-native';
import { useTheme, Button } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Stack
			initialRouteName="(tabs)"
			screenOptions={{
				contentStyle: {
					backgroundColor: theme.colors.background,
				},
				headerShadowVisible: false,
				headerTintColor: theme.colors.onBackground,
				headerTitleStyle: {
					fontFamily: 'Manrope-Regular',
					fontSize: 20,
				},
				headerStyle: { backgroundColor: theme.colors.background },
			}}
		>
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
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
			<Stack.Screen name="new-budget" options={{ title: 'New budget' }} />
			<Stack.Screen
				name="new-subscription"
				options={{ title: 'New subscription' }}
			/>
			<Stack.Screen
				name="transactions-history"
				options={{ title: 'Transactions history' }}
			/>
			<Stack.Screen name="edit-expense" />
			<Stack.Screen name="edit-income" />
			<Stack.Screen name="edit-transfer" />
			<Stack.Screen name="edit-subscription" />
			<Stack.Screen name="edit-budget" />
			<Stack.Screen name="transaction-by-category" />
			<Stack.Screen name="category-form" />
		</Stack>
	);
}

