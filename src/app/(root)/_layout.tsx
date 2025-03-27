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
					fontFamily: 'Inter-Regular',
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
			<Stack.Screen
				name="transaction-detail"
				options={{
					title: '',
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
			<Stack.Screen name="transaction-by-category" />
		</Stack>
	);
}
