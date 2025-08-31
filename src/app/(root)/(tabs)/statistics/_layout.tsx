import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export default function StatisticsScreenLayout() {
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<Tabs
				initialRouteName="stats-by-month"
				screenOptions={{
					tabBarActiveTintColor: theme.colors.onPrimary,
					tabBarActiveBackgroundColor: theme.colors.primary,
					tabBarInactiveBackgroundColor: theme.colors.elevation.level3,
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
						backgroundColor: theme.colors.background,
					},
					tabBarLabelPosition: 'beside-icon',
					tabBarIconStyle: {
						display: 'none',
					},
					headerShown: false,
				}}
			>
				<Tabs.Screen name="stats-by-month" options={{ title: 'Month' }} />
				<Tabs.Screen name="stats-by-year" options={{ title: 'Year' }} />
				<Tabs.Screen name="stats-all" options={{ title: 'All' }} />
			</Tabs>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },

	header: {
		height: 64,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
});

