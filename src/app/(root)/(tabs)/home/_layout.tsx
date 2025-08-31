import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function HomeScreenLayout() {
	const theme = useTheme();

	return (
		<Tabs
			initialRouteName="month"
			screenOptions={{
				tabBarActiveTintColor: theme.colors.onPrimary,
				tabBarActiveBackgroundColor: theme.colors.primary,
				tabBarInactiveBackgroundColor: theme.colors.elevation.level5,
				tabBarInactiveTintColor: theme.colors.onSurface,
				tabBarStyle: {
					position: 'absolute',
					backgroundColor: 'rgba(0,0,0,0)',
					top: 4,
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
					backgroundColor: theme.colors.elevation.level1,
				},
				tabBarLabelPosition: 'beside-icon',
				tabBarIconStyle: {
					display: 'none',
				},
				headerShown: false,
			}}
		>
			<Tabs.Screen name="month" />
			<Tabs.Screen name="year" />
			<Tabs.Screen name="all" />
		</Tabs>
	);
}

const styles = StyleSheet.create({
	header: {
		height: 64,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
});

