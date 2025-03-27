import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();
	const router = useRouter();

	return (
		<Stack
			screenOptions={{
				headerTintColor: theme.colors.onBackground,
				headerShadowVisible: false,
				contentStyle: { backgroundColor: theme.colors.background },
				headerStyle: {
					backgroundColor: theme.colors.background,
				},
			}}
		>
			<Stack.Screen
				name="index"
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
							<Button
								onPress={() => router.push('/settings/accounts/add-account')}
							>
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
			<Stack.Screen name="add-account" options={{ title: 'Add account' }} />
			<Stack.Screen name="edit-account" options={{ title: 'Edit account' }} />
		</Stack>
	);
}
