import { ScrollView, View } from 'react-native';

import Greeting from '@/components/home-screen/greeting';
import Balance from '@/components/home-screen/balance';
import RecentActivities from '@/components/home-screen/recent-activities';
import WalletList from '@/components/home-screen/wallets';
import { useContext } from 'react';
import {
	ExpenseContext,
	ExpenseContextTypes,
} from '@/context/ExpensesProvider';

export default function HomeScreen() {
	const { allExpenses, getCurrentBalance } = useContext(
		ExpenseContext
	) as ExpenseContextTypes;

	return (
		<ScrollView
			scrollEnabled={true}
			showsVerticalScrollIndicator={false}
			className="w-full bg-red-100/10"
		>
			<Greeting />
			<Balance balance={getCurrentBalance()} />
			<WalletList />

			<View className="h-full">
				<RecentActivities activities={allExpenses} showDetailsButton={false} />
			</View>
		</ScrollView>
	);
}
