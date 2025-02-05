import { useContext } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import CloseIcon from '@/assets/svg/close_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import DeleteForeverIcon from '@/assets/svg/delete_forever_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import EditIcon from '@/assets/svg/edit_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';

import {
	SubscriptionContext,
	SubscriptionContextTypess,
} from '@/context/SubscriptionProvider';

export default function DetailsScreen() {
	const { id } = useLocalSearchParams();
	const { getSubscriptionById, deleteSubscriptionById } = useContext(
		SubscriptionContext
	) as SubscriptionContextTypess;

	const subscription = getSubscriptionById(Number(id));

	const formattedDate = new Date(subscription.due_date).toLocaleDateString(
		'en-US',
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}
	);

	const showDeleteItemAlert = () =>
		Alert.alert(
			'Are you sure you want to delete this item?',
			'This action is permanent.',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Proceed',
					onPress: () => {
						deleteSubscriptionById(Number(id));

						router.replace('/(root)/(tabs)/subscription');
					},
					style: 'destructive',
				},
			],
			{ cancelable: true }
		);

	return (
		<View className="pt-16 bg-[#FF2C4A] h-full">
			<View className="px-6 flex-row justify-between">
				<TouchableOpacity
					onPress={() => router.back()}
					className="w-12 h-12 items-center justify-center rounded-full border border-white"
				>
					<CloseIcon />
				</TouchableOpacity>

				<View className="gap-2 flex-row">
					<TouchableOpacity
						onPress={() =>
							router.replace(`/subscription-edit/${subscription.id}`)
						}
						className="w-12 h-12 items-center justify-center rounded-full border border-white"
					>
						<EditIcon />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => showDeleteItemAlert()}
						className="w-12 h-12 items-center justify-center rounded-full border border-white"
					>
						<DeleteForeverIcon />
					</TouchableOpacity>
				</View>
			</View>

			<View className="m-6 bg-white rounded-2xl">
				<View className="gap-1 p-6 border-b border-dashed border-slate-300 relative">
					<Text className="text-sm text-slate-600 text-center">Item name</Text>
					<Text className="text-center text-xl text-slate-900 font-bold">
						{subscription.description}
					</Text>

					<View className="absolute bg-[#FF2C4A] w-8 h-8 rounded-full -left-4 -bottom-4" />
					<View className="absolute bg-[#FF2C4A] w-8 h-8 rounded-full -right-4 -bottom-4" />
				</View>

				<View className="gap-8">
					<View className="flex-row justify-between p-6 w-full border-b border-slate-100">
						<Text>Status</Text>
						<Text className="capitalize">{subscription.is_paid}</Text>
					</View>

					<View className="flex-row justify-between p-6 w-full border-b border-dashed border-slate-200">
						<Text>Total</Text>
						<Text>Rp {subscription.total.toLocaleString('id-ID')}</Text>
					</View>

					<View className="flex-row justify-between px-6 pb-6">
						<Text>Added at</Text>
						<Text>{formattedDate}</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
