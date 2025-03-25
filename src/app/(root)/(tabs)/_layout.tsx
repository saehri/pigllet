import { Tabs, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import {
	CalendarSync,
	House,
	Plus,
	Receipt,
	ScrollText,
	Settings,
} from 'lucide-react-native';

import AddBudgetModal from '@/src/components/modals/add-budget-modal';

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
				tabBarActiveTintColor: theme.colors.primary,
				tabBarStyle: {
					backgroundColor: theme.colors.background,
					height: 60,
					borderTopWidth: 0,
					paddingBottom: 10,
				},
				headerTitleStyle: {
					fontFamily: 'Inter-Regular',
					color: theme.colors.onBackground,
					textTransform: 'capitalize',
				},
				tabBarLabelStyle: {
					fontFamily: 'Inter-Regular',
					fontSize: 14,
				},
				headerShadowVisible: false,
				sceneStyle: {
					backgroundColor: theme.colors.background,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: (props) => (
						<House
							size={props.size}
							color={props.color}
							strokeWidth={1.5}
							fillOpacity={props.focused ? 0.3 : 0}
							fill={
								props.focused ? theme.colors.primary : theme.colors.background
							}
						/>
					),
					headerStyle: {
						backgroundColor: theme.colors.background,
					},
					headerTitle: (props) => (
						<Text variant="titleLarge" style={{ fontFamily: 'Inter-Bold' }}>
							Pigllet
						</Text>
					),
					headerRight: (props) => (
						<View style={{ backgroundColor: theme.colors.background }}>
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
				name="transactions"
				options={{
					title: 'Transactions',
					tabBarIcon: (props) => (
						<Receipt
							size={props.size}
							color={props.color}
							strokeWidth={1.5}
							fillOpacity={props.focused ? 0.3 : 0}
							fill={
								props.focused ? theme.colors.primary : theme.colors.background
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
							size={props.size}
							color={props.color}
							strokeWidth={1.5}
							fillOpacity={props.focused ? 0.3 : 0}
							fill={
								props.focused ? theme.colors.primary : theme.colors.background
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
							<Button>
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
							size={props.size}
							color={props.color}
							strokeWidth={1.5}
							fillOpacity={props.focused ? 0.3 : 0}
							fill={
								props.focused ? theme.colors.primary : theme.colors.background
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
							<AddBudgetModal />
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
