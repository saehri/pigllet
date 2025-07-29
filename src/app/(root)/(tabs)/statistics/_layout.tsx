import { Tabs, useRouter } from 'expo-router';
import { SettingsIcon } from 'lucide-react-native';
import { Button, useTheme } from 'react-native-paper';

import AccountMiniViewer from '@/src/components/reusables/account-mini-viewer';

export default function StatisticsScreenLayout() {
	const theme = useTheme();
	const router = useRouter();

	return (
		<Tabs
			initialRouteName="stats-by-month"
			screenOptions={{
				tabBarActiveTintColor: theme.colors.onPrimary,
				tabBarActiveBackgroundColor: theme.colors.primary,
				tabBarInactiveBackgroundColor: theme.colors.primaryContainer,
				tabBarInactiveTintColor: theme.colors.onPrimaryContainer,
				tabBarStyle: {
					position: 'absolute',
					backgroundColor: 'rgba(0,0,0,0)',
					top: 63,
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
						contentStyle={{ height: 40 }}
					>
						<SettingsIcon
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
							size={20}
						/>
					</Button>
				),
				headerTitle: () => <AccountMiniViewer />,
			}}
		>
			<Tabs.Screen name="stats-by-month" options={{ title: 'Month' }} />
			<Tabs.Screen name="stats-by-year" options={{ title: 'Year' }} />
			<Tabs.Screen name="stats-all" options={{ title: 'All' }} />
		</Tabs>
	);
}

