import { Stack } from 'expo-router';
import { CalculatorIcon } from 'lucide-react-native';
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
						<Button mode="contained-tonal" style={{ height: 40 }}>
							<CalculatorIcon
								strokeWidth={1.5}
								color={theme.colors.onSecondaryContainer}
								size={20}
							/>
						</Button>
					),
				}}
			/>
			<Stack.Screen name="new-budget" options={{ title: 'New budget' }} />
			<Stack.Screen name="edit-expense" />
			<Stack.Screen name="edit-income" />
			<Stack.Screen name="edit-transfer" />
			<Stack.Screen name="edit-budget" options={{ title: 'Edit budget' }} />
			<Stack.Screen name="budget-detail" />
			<Stack.Screen name="category-form" />
		</Stack>
	);
}

