import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function HomeScreenLayout() {
	const theme = useTheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.colors.onPrimary,
				tabBarActiveBackgroundColor: theme.colors.primary,
				tabBarInactiveBackgroundColor: theme.colors.primaryContainer,
				tabBarInactiveTintColor: theme.colors.onPrimaryContainer,
				tabBarStyle: {
					position: 'absolute',
					backgroundColor: theme.colors.background,
					top: 0,
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
				},
				tabBarItemStyle: {
					overflow: 'hidden',
					borderRadius: 12,
					height: 40,
				},
				tabBarLabelPosition: 'beside-icon',
				tabBarIconStyle: {
					display: 'none',
				},
				headerShadowVisible: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'All',
				}}
			/>
			<Tabs.Screen
				name="monthly"
				options={{
					title: 'Monthly',
				}}
			/>
			<Tabs.Screen
				name="yearly"
				options={{
					title: 'Yearly',
				}}
			/>
		</Tabs>
	);
}

