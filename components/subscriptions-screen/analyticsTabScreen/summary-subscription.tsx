import {
	SubscriptionContext,
	SubscriptionContextTypes,
} from '@/context/SubscriptionProvider';
import { useContext } from 'react';
import { View, Text } from 'react-native';

export default function SummarySubscription() {
	const { allSubscriptions } = useContext(
		SubscriptionContext
	) as SubscriptionContextTypes;

	const totalPayments = allSubscriptions.reduce(
		(sum, subs) => sum + subs.total,
		0
	);

	const avgPaymentMonthly =
		allSubscriptions.length > 0 ? totalPayments / allSubscriptions.length : 0;

	const highestPayment =
		allSubscriptions.length > 0
			? Math.max(...allSubscriptions.map((subs) => subs.total))
			: 0;

	const lowestPayment =
		allSubscriptions.length > 0
			? Math.min(...allSubscriptions.map((subs) => subs.total))
			: 0;

	const formatNumber = (number: number) => {
		return new Intl.NumberFormat('id-ID').format(number);
	};

	return (
		<View className="px-6 pt-4">
			<View className="flex-row justify-between w-full">
				<Text>Your avg. payment (monthly)</Text>
				<Text>Rp {formatNumber(avgPaymentMonthly)}</Text>
			</View>

			<View className="flex-row justify-between">
				<Text>Highest payment</Text>
				<Text>Rp {formatNumber(highestPayment)}</Text>
			</View>

			<View className="flex-row justify-between">
				<Text>Lowest payment</Text>
				<Text>Rp {formatNumber(lowestPayment)}</Text>
			</View>
		</View>
	);
}
