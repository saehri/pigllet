import { Tabs } from 'expo-router';
import {
	CircleArrowOutDownLeft,
	CircleArrowOutUpRight,
	ShoppingBasket,
} from 'lucide-react-native';
import { useTheme } from 'react-native-paper';

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
					top: 8,
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
					fontFamily: 'Manrope-Regular',
					fontSize: 14,
				},
				tabBarLabelPosition: 'beside-icon',
			}}
			backBehavior="none"
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

