import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

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
					title: '',
				}}
			/>
			<Stack.Screen name="add-account" options={{ title: 'Add account' }} />
			<Stack.Screen name="edit-account" options={{ title: 'Edit account' }} />
		</Stack>
	);
}

