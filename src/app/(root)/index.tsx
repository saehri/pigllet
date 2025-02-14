import { useState } from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';

import HomeScreen from '@/src/components/screen/home';
import TransactionScreen from '@/src/components/screen/transaction';
import SubscriptionScreen from '@/src/components/screen/subscription';
import WalletScreen from '@/src/components/screen/wallet';

export default function Layout() {
	const theme = useTheme();

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
			compact
			barStyle={{ backgroundColor: theme.colors.background }}
		/>
	);
}
