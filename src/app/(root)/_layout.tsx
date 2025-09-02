import { Stack } from 'expo-router';
import { Appbar, useTheme } from 'react-native-paper';

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
				header: (props) => (
					<Appbar.Header
						style={{
							backgroundColor: theme.colors.background,
							zIndex: 10,
						}}
					>
						<Appbar.BackAction onPress={() => props.navigation.goBack()} />
						<Appbar.Content
							title={props.options.title ?? props.route.name}
							titleStyle={{ fontFamily: 'Manrope-Medium', fontSize: 20 }}
						/>
					</Appbar.Header>
				),
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
				}}
			/>
			<Stack.Screen name="new-budget" options={{ title: 'New budget' }} />
			<Stack.Screen name="edit-expense" />
			<Stack.Screen name="edit-income" />
			<Stack.Screen name="edit-transfer" />
			<Stack.Screen name="edit-budget" options={{ title: 'Edit budget' }} />
			<Stack.Screen name="budget-detail" options={{ headerShown: false }} />
			<Stack.Screen name="category-form" />
		</Stack>
	);
}

