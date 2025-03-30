import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import {
	CircleArrowOutUpRight,
	CircleArrowOutDownLeft,
	ShoppingBasket,
} from 'lucide-react-native';

export default function Layout() {
	const theme = useTheme();

	return (
		<Tabs
			initialRouteName="expense"
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.colors.onPrimary,
				tabBarActiveBackgroundColor: theme.colors.primary,
				tabBarStyle: {
					backgroundColor: theme.colors.elevation.level1,
					height: 40,
					position: 'absolute',
					top: 0,
					borderWidth: 1,
					borderTopWidth: 1,
					borderRadius: 1000,
					borderColor: theme.colors.outlineVariant,
					marginHorizontal: 16,
					overflow: 'hidden',
				},
				tabBarItemStyle: {
					overflow: 'hidden',
				},
				tabBarLabelStyle: {
					fontFamily: 'Inter-Regular',
					fontSize: 14,
				},
				tabBarLabelPosition: 'beside-icon',
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
