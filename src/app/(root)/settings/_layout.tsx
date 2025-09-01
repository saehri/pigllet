import { Stack } from 'expo-router';
import { Appbar, useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Stack
			initialRouteName="index"
			screenOptions={{
				headerTintColor: theme.colors.onBackground,
				headerShadowVisible: false,
				headerStyle: {
					backgroundColor: theme.colors.background,
				},
				headerTitleStyle: {
					fontFamily: 'Manrope-Regular',
					fontSize: 20,
				},
				contentStyle: {
					backgroundColor: theme.colors.background,
				},
				header: (props) => (
					<Appbar.Header
						style={{
							backgroundColor: theme.colors.background,
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
					headerShown: false,
				}}
			/>
			<Stack.Screen name="accounts" options={{ headerShown: false }} />
		</Stack>
	);
}

