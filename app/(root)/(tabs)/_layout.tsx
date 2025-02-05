import React from 'react';
import { Tabs } from 'expo-router';
import BottomTabNavigatorIcon from '@/components/bottom-tab-navigator';

const tabsMenu = [
	{ name: 'home-screen', title: 'Home', iconType: 'home' },
	{ name: 'expense', title: 'Expense', iconType: 'expense' },
	{
		name: 'subscription',
		title: 'Subscriptions',
		iconType: 'subscriptions',
	},
	{ name: 'profile-screen', title: 'Profile', iconType: 'profile' },
];

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={() => ({
				headerShown: false,
				tabBarShowLabel: true,
				tabBarActiveTintColor: '#FF2C4A',
				tabBarStyle: {
					backgroundColor: '#FFFFFF',
					height: 70,
					alignItems: 'baseline',
					paddingTop: 10,
					paddingBottom: 20,
				},
			})}
		>
			{tabsMenu.map((menu) => (
				<Tabs.Screen
					key={menu.name}
					name={menu.name}
					options={{
						title: menu.title,
						tabBarIcon: ({ focused }) => (
							<BottomTabNavigatorIcon
								type={menu.iconType as any}
								focused={focused}
							/>
						),
					}}
				/>
			))}
		</Tabs>
	);
}
