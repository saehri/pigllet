import { Tabs } from 'expo-router';
import {
	ArrowRightLeft,
	CircleArrowOutDownLeft,
	CircleArrowOutUpRight,
} from 'lucide-react-native';
import { useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.colors.background,
				tabBarActiveBackgroundColor: theme.colors.primary,
				tabBarStyle: {
					position: 'absolute',
					top: 4,
					left: 16,
					right: 16,
					borderRadius: 1000,
					overflow: 'hidden',
					backgroundColor: theme.colors.elevation.level2,
					height: 40,
					borderWidth: 1,
					borderColor: theme.colors.outline,
					borderTopWidth: 1,
				},
				tabBarItemStyle: {
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 4,
				},
				tabBarIconStyle: {
					width: 20,
					height: 20,
					alignItems: 'center',
					flex: 0,
				},
				tabBarLabelStyle: {
					fontFamily: 'Inter-Regular',
					fontSize: 14,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Expense',
					tabBarIcon: (props) => (
						<CircleArrowOutUpRight
							color={props.color}
							size={14}
							strokeWidth={1.5}
						/>
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
						<ArrowRightLeft color={props.color} size={14} strokeWidth={1.5} />
					),
				}}
			/>
		</Tabs>
	);
}
