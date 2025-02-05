import { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';

import HomeScreen from './main/home-screen';
import SettingScreen from './main/setting-screen';
import TransactionScreen from './main/transaction-screen';
import SubscriptionScreen from './main/subscription-screen';

export default function MainScreen() {
	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{
			key: 'home',
			title: 'Home',
			focusedIcon: 'home',
			unfocusedIcon: 'home-outline',
		},
		{ key: 'transactions', title: 'Transactions', focusedIcon: 'receipt' },
		{
			key: 'subscriptions',
			title: 'Subscriptions',
			focusedIcon: 'autorenew',
		},
		{
			key: 'settings',
			title: 'Settings',
			focusedIcon: 'cog',
			unfocusedIcon: 'cog-outline',
		},
	]);

	const renderScene = BottomNavigation.SceneMap({
		home: HomeScreen,
		transactions: TransactionScreen,
		subscriptions: SubscriptionScreen,
		settings: SettingScreen,
	});

	return (
		<BottomNavigation
			navigationState={{ index, routes }}
			onIndexChange={setIndex}
			renderScene={renderScene}
			sceneAnimationEnabled
			sceneAnimationType="shifting"
			labelMaxFontSizeMultiplier={3}
		/>
	);
}
