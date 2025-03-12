import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
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

	return (
		<Tabs
			initialRouteName="index"
			screenOptions={{
				tabBarActiveTintColor: theme.colors.primary,
				tabBarStyle: {
					backgroundColor: theme.colors.background,
					height: 65,
					borderTopWidth: 0,
					paddingVertical: 8,
					paddingBottom: 10,
				},
				headerTitleStyle: {
					fontFamily: 'Inter-Black',
					color: theme.colors.onBackground,
					textTransform: 'capitalize',
				},
				tabBarLabelStyle: {
					fontFamily: 'Inter-Regular',
					fontSize: 14,
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
						<Text variant="titleLarge" style={{ fontFamily: 'Inter-Black' }}>
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
					headerTitle: (props) => (
						<Text variant="titleLarge" style={{ fontFamily: 'Inter-Black' }}>
							Transactions
						</Text>
					),
					headerRight: (props) => (
						<View
							style={{
								backgroundColor: theme.colors.background,
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Button onPress={() => router.push('/(root)/new-transactions')}>
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
					headerTitle: (props) => (
						<Text variant="titleLarge" style={{ fontFamily: 'Inter-Black' }}>
							Subscriptions
						</Text>
					),
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
					headerTitle: (props) => (
						<Text variant="titleLarge" style={{ fontFamily: 'Inter-Black' }}>
							Budgets
						</Text>
					),
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

const styles = StyleSheet.create({
	appbarTitle: {
		fontFamily: 'Inter-Black',
		letterSpacing: -0.5,
	},
});
