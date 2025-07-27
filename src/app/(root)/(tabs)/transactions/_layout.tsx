import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import {
	CircleArrowOutUpRight,
	CircleArrowOutDownLeft,
	ShoppingBasket,
} from 'lucide-react-native';

export default function TransactionsScreenLayout() {
	const theme = useTheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.colors.onPrimary,
				tabBarActiveBackgroundColor: theme.colors.primary,
				tabBarInactiveBackgroundColor: theme.colors.primaryContainer,
				tabBarInactiveTintColor: theme.colors.onPrimaryContainer,
				tabBarStyle: {
					position: 'absolute',
					backgroundColor: theme.colors.background,
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
				},
				tabBarItemStyle: {
					overflow: 'hidden',
					borderRadius: 12,
					height: 40,
				},
				tabBarLabelPosition: 'beside-icon',
				tabBarIconStyle: {
					display: 'none',
				},
				headerShadowVisible: false,
			}}
		>
			<Tabs.Screen
				name="expense"
				options={{
					title: 'Expense',
					tabBarIcon: (props) => (
						<ShoppingBasket color={props.color} size={14} strokeWidth={1.5} />
					),
				}}
			/>
			<Tabs.Screen
				name="income"
				options={{
					title: 'Income',
					tabBarIcon: (props) => (
						<CircleArrowOutDownLeft
							color={props.color}
							size={14}
							strokeWidth={1.5}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="transfer"
				options={{
					title: 'Transfer',
					tabBarIcon: (props) => (
						<CircleArrowOutUpRight
							color={props.color}
							size={14}
							strokeWidth={1.5}
						/>
					),
				}}
			/>
		</Tabs>
	);
}

