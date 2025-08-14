import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Tabs
			initialRouteName="expense"
			screenOptions={{
				tabBarActiveTintColor: theme.colors.onPrimary,
				tabBarActiveBackgroundColor: theme.colors.primary,
				tabBarInactiveBackgroundColor: theme.colors.primaryContainer,
				tabBarInactiveTintColor: theme.colors.onPrimaryContainer,
				tabBarStyle: {
					position: 'absolute',
					backgroundColor: 'rgba(0,0,0,0)',
					top: 8,
					borderTopWidth: 0,
					marginHorizontal: 16,
					elevation: 0,
					shadowOpacity: 0,
					gap: 12,
					borderRadius: 8,
					height: 40,
				},
				tabBarLabelStyle: {
					fontFamily: 'Manrope-Medium',
					fontSize: 14,
					textTransform: 'capitalize',
				},
				tabBarItemStyle: {
					overflow: 'hidden',
					borderRadius: 12,
					height: 40,
				},
				sceneStyle: {
					backgroundColor: theme.colors.background,
				},
				tabBarLabelPosition: 'beside-icon',
				tabBarIconStyle: {
					display: 'none',
				},
				headerShown: false,
			}}
			backBehavior="none"
		>
			<Tabs.Screen name="expense" />
			<Tabs.Screen name="income" />
			<Tabs.Screen name="transfer" />
		</Tabs>
	);
}

