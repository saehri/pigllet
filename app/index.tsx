import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { BottomNavigation } from 'react-native-paper';

import HomeScreen from './main/home-screen';
import WalletScreen from './main/wallet-screen';
import TransactionScreen from './main/transaction-screen';
import SubscriptionScreen from './main/subscription-screen';

export default function MainScreen() {
	const colorScheme = useColorScheme();

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
			key: 'wallets',
			title: 'Wallets',
			focusedIcon: 'wallet',
			unfocusedIcon: 'wallet-outline',
		},
	]);

	const renderScene = BottomNavigation.SceneMap({
		home: HomeScreen,
		transactions: TransactionScreen,
		subscriptions: SubscriptionScreen,
		wallets: WalletScreen,
	});

	return (
		<BottomNavigation
			navigationState={{ index, routes }}
			onIndexChange={setIndex}
			renderScene={renderScene}
			sceneAnimationEnabled
			sceneAnimationType="shifting"
			labelMaxFontSizeMultiplier={3}
			barStyle={{
				backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
			}}
		/>
	);
}
