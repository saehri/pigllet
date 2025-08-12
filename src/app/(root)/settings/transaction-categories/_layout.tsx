import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<View style={styles.container}>
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
						backgroundColor: theme.colors.background,
					},
					tabBarLabelPosition: 'beside-icon',
					tabBarIconStyle: {
						display: 'none',
					},
					headerShown: false,
				}}
			>
				<Tabs.Screen name="expense" />
				<Tabs.Screen name="income" />
				<Tabs.Screen name="transfer" />
			</Tabs>

			<FAB
				icon="plus"
				style={styles.fab}
				// onPress={() => router.push('/(root)/new-transactions/expense')}
				mode="flat"
				variant="secondary"
				size="medium"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 40,
	},
});

