import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Layout() {
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<LinearGradient
				colors={[theme.colors.background, 'transparent']}
				start={{ x: 0.5, y: 0.5 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					position: 'absolute',
					top: 0,
					zIndex: 1,
					left: 0,
					width: '100%',
					height: 70,
				}}
			/>

			<Tabs
				initialRouteName="expense"
				screenOptions={{
					tabBarActiveTintColor: theme.colors.onPrimary,
					tabBarActiveBackgroundColor: theme.colors.primary,
					tabBarInactiveBackgroundColor: theme.colors.elevation.level3,
					tabBarInactiveTintColor: theme.colors.onSurface,
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
						zIndex: 10,
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});

