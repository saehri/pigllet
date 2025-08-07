import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import {
	CalendarSync,
	ChartPieIcon,
	House,
	Plus,
	ScrollText,
	Settings,
	SettingsIcon,
} from 'lucide-react-native';

import AccountMiniViewer from '@/src/components/reusables/account-mini-viewer';
import { LinearGradient } from 'expo-linear-gradient';

export default function Layout() {
	const theme = useTheme();
	const router = useRouter();

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					height: 64,
					backgroundColor: theme.colors.background,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingHorizontal: 16,
				}}
			>
				<AccountMiniViewer />

				<Button
					mode="contained-tonal"
					onPress={() => router.push('/(root)/settings')}
					style={{ borderRadius: 12 }}
					contentStyle={{ height: 40 }}
				>
					<SettingsIcon
						strokeWidth={1.5}
						color={theme.colors.onSecondaryContainer}
						size={20}
					/>
				</Button>
			</View>

			<Tabs
				initialRouteName="home"
				screenOptions={{
					tabBarActiveTintColor: theme.colors.onPrimary,
					tabBarActiveBackgroundColor: theme.colors.primary,
					tabBarInactiveBackgroundColor: theme.colors.primaryContainer,
					tabBarInactiveTintColor: theme.colors.onPrimaryContainer,
					tabBarStyle: {
						backgroundColor: theme.colors.elevation.level1,
						height: 52,
						marginHorizontal: 50,
						bottom: 16,
						elevation: 0,
						shadowOpacity: 0,
						position: 'absolute',
						borderRadius: 12,
						overflow: 'hidden',
						alignItems: 'center',
						paddingHorizontal: 5,
						borderTopWidth: 1,
						borderWidth: 1,
						borderColor: theme.colors.outlineVariant,
						zIndex: 10,
					},
					tabBarItemStyle: {
						overflow: 'hidden',
						borderRadius: 9,
						height: 40,
						marginTop: 5,
					},
					tabBarLabelStyle: {
						fontFamily: 'Manrope-Bold',
						fontSize: 10,
					},
					sceneStyle: {
						backgroundColor: theme.colors.background,
					},
					tabBarShowLabel: false,
					headerShown: false,
				}}
			>
				<Tabs.Screen
					name="home"
					options={{
						tabBarIcon: (props) => (
							<House
								size={20}
								color={props.color}
								strokeWidth={1.5}
								fillOpacity={props.focused ? 0.3 : 0}
								fill={
									props.focused
										? theme.colors.onPrimary
										: theme.colors.background
								}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="statistics"
					options={{
						tabBarIcon: (props) => (
							<ChartPieIcon
								size={20}
								color={props.color}
								strokeWidth={1.5}
								fillOpacity={props.focused ? 0.3 : 0}
								fill={
									props.focused
										? theme.colors.onPrimary
										: theme.colors.background
								}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="subscriptions"
					options={{
						title: 'Subscriptions',
						tabBarIcon: (props) => (
							<CalendarSync
								size={20}
								color={props.color}
								strokeWidth={1.5}
								fillOpacity={props.focused ? 0.3 : 0}
								fill={
									props.focused
										? theme.colors.onPrimary
										: theme.colors.background
								}
							/>
						),
						headerRight: (props) => (
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									paddingRight: 16,
								}}
							>
								<Button
									mode="contained-tonal"
									onPress={() => router.push('/(root)/new-subscription')}
									contentStyle={{ height: 40 }}
								>
									<Plus
										strokeWidth={1.5}
										color={theme.colors.onBackground}
										size={24}
									/>
								</Button>

								<Button
									mode="contained-tonal"
									onPress={() => router.push('/(root)/settings')}
									contentStyle={{
										height: 40,
									}}
								>
									<Settings
										strokeWidth={1.5}
										color={theme.colors.onSecondaryContainer}
										size={20}
									/>
								</Button>
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="budget"
					options={{
						title: 'Budgets',
						tabBarIcon: (props) => (
							<ScrollText
								size={20}
								color={props.color}
								strokeWidth={1.5}
								fillOpacity={props.focused ? 0.3 : 0}
								fill={
									props.focused
										? theme.colors.onPrimary
										: theme.colors.background
								}
							/>
						),
						headerRight: (props) => (
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									paddingRight: 16,
								}}
							>
								<Button
									onPress={() => router.push('/(root)/new-budget')}
									mode="contained-tonal"
									contentStyle={{
										height: 40,
									}}
								>
									<Plus
										strokeWidth={1.5}
										color={theme.colors.onBackground}
										size={24}
									/>
								</Button>
								<Button
									onPress={() => router.push('/(root)/settings')}
									mode="contained-tonal"
									contentStyle={{
										height: 40,
									}}
								>
									<Settings
										strokeWidth={1.5}
										color={theme.colors.onSecondaryContainer}
										size={20}
									/>
								</Button>
							</View>
						),
					}}
				/>
			</Tabs>

			<LinearGradient
				colors={['black', 'transparent']}
				start={{ x: 0.5, y: 1 }}
				end={{ x: 0.5, y: 0 }}
				style={{
					position: 'absolute',
					bottom: 0,
					zIndex: 1,
					left: 0,
					width: '100%',
					height: 100,
				}}
			/>
		</View>
	);
}

