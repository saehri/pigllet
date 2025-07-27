import { Tabs, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import {
	CalendarSync,
	HomeIcon,
	House,
	Plus,
	Receipt,
	ScrollText,
	Settings,
} from 'lucide-react-native';

export default function Layout() {
	const theme = useTheme();
	const router = useRouter();
	const pathname = usePathname();

	function navigateTo(): any {
		if (pathname === '/transactions/expense')
			return '/(root)/new-transactions/expense';
		if (pathname === '/transactions/income')
			return '/(root)/new-transactions/income';
		if (pathname === '/transactions/transfer')
			return '/(root)/new-transactions/transfer';
	}

	return (
		<Tabs
			initialRouteName="home"
			screenOptions={{
				tabBarActiveTintColor: theme.colors.onPrimary,
				tabBarInactiveBackgroundColor: theme.colors.elevation.level5,
				tabBarActiveBackgroundColor: theme.colors.primary,
				tabBarStyle: {
					backgroundColor: theme.colors.elevation.level2,
					height: 52,
					marginHorizontal: 30,
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
				},
				headerTitleStyle: {
					fontFamily: 'Manrope-Regular',
					color: theme.colors.onBackground,
					textTransform: 'capitalize',
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
				headerShadowVisible: false,
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: (props) => (
						<House
							size={20}
							color={props.color}
							strokeWidth={1.5}
							fillOpacity={props.focused ? 0.3 : 0}
							fill={
								props.focused ? theme.colors.onPrimary : theme.colors.background
							}
						/>
					),
					headerStyle: {
						backgroundColor: theme.colors.background,
					},
					headerTitle: () => (
						<Text
							variant="titleLarge"
							style={{ fontFamily: 'Manrope-Bold', letterSpacing: -1 }}
						>
							Pigllet
						</Text>
					),
					headerRight: (props) => (
						<View
							style={{
								backgroundColor: theme.colors.background,
								paddingRight: 16,
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Button
								mode="contained-tonal"
								onPress={() => router.push('/(root)/new-transactions/expense')}
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
								contentStyle={{ height: 40 }}
							>
								<Settings
									strokeWidth={1.5}
									color={theme.colors.onBackground}
									size={20}
								/>
							</Button>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="transactions"
				options={{
					title: 'Transactions',
					tabBarIcon: (props) => (
						<Receipt
							size={20}
							color={props.color}
							strokeWidth={1.5}
							fillOpacity={props.focused ? 0.3 : 0}
							fill={
								props.focused ? theme.colors.onPrimary : theme.colors.background
							}
						/>
					),
					headerStyle: {
						backgroundColor: theme.colors.background,
					},
					headerRight: (props) => (
						<View
							style={{
								backgroundColor: theme.colors.background,
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Button onPress={() => router.push(navigateTo())}>
								<Plus
									strokeWidth={1.5}
									color={theme.colors.onBackground}
									size={24}
								/>
							</Button>
							<Button onPress={() => router.push('/(root)/settings')}>
								<Settings
									strokeWidth={1.5}
									color={theme.colors.onBackground}
									size={24}
								/>
							</Button>
						</View>
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
								props.focused ? theme.colors.onPrimary : theme.colors.background
							}
						/>
					),
					headerStyle: {
						backgroundColor: theme.colors.background,
					},
					headerRight: (props) => (
						<View
							style={{
								backgroundColor: theme.colors.background,
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Button onPress={() => router.push('/(root)/new-subscription')}>
								<Plus
									strokeWidth={1.5}
									color={theme.colors.onBackground}
									size={24}
								/>
							</Button>

							<Button onPress={() => router.push('/(root)/settings')}>
								<Settings
									strokeWidth={1.5}
									color={theme.colors.onBackground}
									size={24}
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
								props.focused ? theme.colors.onPrimary : theme.colors.background
							}
						/>
					),
					headerStyle: {
						backgroundColor: theme.colors.background,
					},
					headerRight: (props) => (
						<View
							style={{
								backgroundColor: theme.colors.background,
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Button onPress={() => router.push('/(root)/new-budget')}>
								<Plus
									strokeWidth={1.5}
									color={theme.colors.onBackground}
									size={24}
								/>
							</Button>
							<Button onPress={() => router.push('/(root)/settings')}>
								<Settings
									strokeWidth={1.5}
									color={theme.colors.onBackground}
									size={24}
								/>
							</Button>
						</View>
					),
				}}
			/>
		</Tabs>
	);
}

