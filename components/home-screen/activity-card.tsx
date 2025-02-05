import { router } from 'expo-router';
import { Text, TouchableHighlight, View } from 'react-native';
import { transactionTypes } from '@/constants/transactions';

interface ActivityCard {
	transactionType: transactionTypes;
	description: string;
	date: string;
	wallet: string;
	total: number;
	category?: string;
	id: number;
}

export default function ActivityCard({
	transactionType,
	date,
	description,
	total,
	wallet,
	category,
	id,
}: ActivityCard) {
	const formatedDate = new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	const prefixForTotal =
		transactionType === 'subscriptions'
			? ''
			: transactionType === 'income'
			? '+'
			: '-';
	const prefixForPaidWith =
		transactionType === 'subscriptions'
			? ''
			: transactionType === 'income'
			? 'Added to'
			: 'Paid with';

	return (
		<TouchableHighlight
			onPress={() => router.navigate(`/expense-details/${id}`)}
			activeOpacity={0.9}
			underlayColor="#eaeaea"
		>
			<View className="flex-row justify-between w-full pt-3 pb-3 px-6">
				<View className="flex-col justify-start gap-1">
					<Text className="text-lg text-slate-900 tracking-tight">
						{description}
					</Text>
					<Text className="text-slate-600 tracking-tight">{formatedDate}</Text>

					<Text className="text-slate-600 tracking-tight">
						{prefixForPaidWith} {wallet}
					</Text>
				</View>

				<View className="items-end gap-1">
					<Text className="text-lg tracking-tight">
						{prefixForTotal} Rp {total ? total.toLocaleString('id-ID') : 0}
					</Text>

					<Text className=" text-sm text-slate-600 tracking-tight capitalize">
						{transactionType}
					</Text>

					{category && (
						<Text className="text-xs text-white bg-red-400 p-1 px-2 rounded-full tracking-tight">
							{category}
						</Text>
					)}
				</View>
			</View>
		</TouchableHighlight>
	);
}
