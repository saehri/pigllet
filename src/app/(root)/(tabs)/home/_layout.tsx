import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, FAB, useTheme } from 'react-native-paper';

import { SettingsIcon } from 'lucide-react-native';

export default function HomeScreenLayout() {
	const theme = useTheme();
	const router = useRouter();

	return (
		<View style={styles.container}>
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
					headerRight: () => (
						<Button
							mode="contained-tonal"
							onPress={() => router.push('/(root)/settings')}
							style={{ marginRight: 16, borderRadius: 12 }}
						>
							<SettingsIcon
								strokeWidth={1.5}
								color={theme.colors.onSecondaryContainer}
								size={20}
							/>
						</Button>
					),
				}}
			>
				<Tabs.Screen
					name="monthly"
					options={{
						title: 'Month',
						// headerTitle: () => <MonthScreenHeaderTitlePlaceholder />,
					}}
				/>
				<Tabs.Screen
					name="yearly"
					options={{
						title: 'Year',
						// headerTitle: () => <YearlyScreenHeaderTitlePlaceholder />,
					}}
				/>
				<Tabs.Screen
					name="all"
					options={{
						title: 'All',
						// headerTitle: () => <AllTransScreenHeaderTitlePlaceholder />,
					}}
				/>
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
});

