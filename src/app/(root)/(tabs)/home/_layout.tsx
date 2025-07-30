import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';

export default function HomeScreenLayout() {
	const theme = useTheme();
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Tabs
				initialRouteName="month"
				screenOptions={{
					tabBarActiveTintColor: theme.colors.onPrimary,
					tabBarActiveBackgroundColor: theme.colors.primary,
					tabBarInactiveBackgroundColor: theme.colors.primaryContainer,
					tabBarInactiveTintColor: theme.colors.onPrimaryContainer,
					tabBarStyle: {
						position: 'absolute',
						backgroundColor: 'rgba(0,0,0,0)',
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

			<FAB
				icon="plus"
				style={styles.fab}
				onPress={() => router.push('/(root)/new-transactions/expense')}
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
		bottom: 80,
	},
	header: {
		height: 64,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
});

