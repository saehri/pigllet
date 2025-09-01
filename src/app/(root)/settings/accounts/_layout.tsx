import { Stack } from 'expo-router';
import { View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Stack
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

						{props.options.headerRight
							? props.options.headerRight({
									tintColor: theme.colors.onBackground,
								})
							: null}
					</Appbar.Header>
				),
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="add-account" options={{ title: 'Add account' }} />
			<Stack.Screen name="edit-account" options={{ title: 'Edit account' }} />
		</Stack>
	);
}

