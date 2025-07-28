import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function HomeScreenLayout() {
	const theme = useTheme();

	return (
		<Tabs
			initialRouteName="monthly"
			screenOptions={{
				tabBarActiveTintColor: theme.colors.onPrimary,
				tabBarActiveBackgroundColor: theme.colors.primary,
				tabBarInactiveBackgroundColor: theme.colors.primaryContainer,
				tabBarInactiveTintColor: theme.colors.onPrimaryContainer,
				tabBarStyle: {
					position: 'absolute',
					backgroundColor: 'rgba(0,0,0,0)',
					top: 65,
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
				headerTitleStyle: {
					fontFamily: 'Manrope-Bold',
					textTransform: 'capitalize',
					letterSpacing: -1,
				},
				tabBarItemStyle: {
					overflow: 'hidden',
					borderRadius: 12,
					height: 40,
				},
				sceneStyle: {
					backgroundColor: theme.colors.elevation.level1,
				},
				tabBarLabelPosition: 'beside-icon',
				tabBarIconStyle: {
					display: 'none',
				},
				headerShadowVisible: false,
				headerStyle: {
					backgroundColor: theme.colors.background,
				},
			}}
		>
			<Tabs.Screen name="monthly" options={{ title: 'Monthly' }} />
			<Tabs.Screen name="yearly" options={{ title: 'Yearly' }} />
			<Tabs.Screen name="all" options={{ title: 'All' }} />
		</Tabs>
	);
}

