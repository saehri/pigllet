import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import {
	CircleArrowOutUpRight,
	CircleArrowOutDownLeft,
	ArrowRightLeft,
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
					backgroundColor: theme.colors.elevation.level2,
					height: 40,
					position: 'absolute',
					top: 0,
					borderWidth: 0,
					borderTopWidth: 0,
					borderRadius: 1000,
					marginHorizontal: 16,
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
