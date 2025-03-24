import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();
	const router = useRouter();

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
			<Stack.Screen
				name="accounts"
				options={{
					title: 'Accounts',
					headerRight: (props) => (
						<View
							style={{
								backgroundColor: theme.colors.background,
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Button>
								<Plus
									strokeWidth={1.5}
									color={theme.colors.onBackground}
									size={24}
								/>
							</Button>
						</View>
					),
				}}
			/>
		</Stack>
	);
}
