import { View, Text, TouchableOpacity, Alert } from 'react-native';
import InputField from '@/components/form/input-field';
import React, { useContext, useState } from 'react';
import CustomDatePicker from '@/components/custom-date-picker';
import Button from '@/components/buttons/custom-button';

import ArrowRightIcon from '@/assets/svg/arrow/keyboard-arrow-right.svg';
import ArrowDownIcon from '@/assets/svg/arrow/keyboard-arrow-down.svg';
import CloseIcon from '@/assets/svg/close_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import DeleteForeverIcon from '@/assets/svg/delete_forever_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';

import {
	SubscriptionContext,
	SubscriptionContextTypes,
} from '@/context/SubscriptionProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RecordSubscriptionForm() {
	const { id } = useLocalSearchParams();
	const {
		loading,
		getSubscriptionById,
		deleteSubscriptionById,
		updateSubscription,
	} = useContext(SubscriptionContext) as SubscriptionContextTypes;

	const subscription = getSubscriptionById(Number(id));

	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [selectedStatus, setSelectedStatus] = useState<'paid' | 'unpaid'>(
		subscription.is_paid
	);

	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [description, setDescription] =
		useState<string>(subscription.description) || '';
	const [total, setTotal] =
		useState<string>(subscription.total.toString()) || '';

	const router = useRouter();

	const handleSubmit = async () => {
		if (!description.trim() || !total.trim()) {
			alert('Please fill in all the fields.');
			return;
		}

		const response: any = await updateSubscription(
			{
				id: Date.now(),
				description: description,
				due_date: currentDate.toISOString(),
				is_paid: selectedStatus,
				total: Number(total),
			},
			Number(id)
		);

		if (response.success) {
			Alert.alert(
				'Expense record updated!',
				'Successfully updated you expense record.',
				[
					{
						text: 'Back',
						style: 'cancel',
						onPress: () => router.replace('/(root)/(tabs)/subscription'),
					},
					{
						text: 'Done',
						style: 'default',
					},
				],
				{
					cancelable: true,
				}
			);
		}
	};

	const showDeleteItemAlert = () =>
		Alert.alert(
			'Are you sure you want to delete this item?',
			'This action is permanent',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Proceed',
					onPress: () => {
						deleteSubscriptionById(Number(id));

						setTimeout(() => {
							router.back();
						}, 250);
					},
					style: 'destructive',
				},
			],
			{
				cancelable: true,
			}
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

				<TouchableOpacity
					onPress={() => showDeleteItemAlert()}
					className="w-12 h-12 items-center justify-center rounded-full border border-white"
				>
					<DeleteForeverIcon />
				</TouchableOpacity>
			</View>

			<View className="py-6 gap-6 bg-white mx-2 mt-8 rounded-xl ">
				<View className="px-6">
					<InputField
						label="Description"
						value={description}
						onChange={(event) => setDescription(event.nativeEvent.text)}
						placeholder="Enter subscription description"
					/>
				</View>

				<View className="flex-row gap-4 px-6">
					<View className="gap-2 w-1/3 relative">
						<Text className="text-slate-900 tracking-tight">Status</Text>
						<TouchableOpacity
							className="flex-row items-center justify-between w-full p-2 border border-red-100 rounded-lg"
							onPress={() => setIsModalVisible(!isModalVisible)}
						>
							<Text className="text-slate-900 text-lg tracking-tight capitalize">
								{selectedStatus}
							</Text>
							{isModalVisible ? <ArrowDownIcon /> : <ArrowRightIcon />}
						</TouchableOpacity>

						{isModalVisible && (
							<View className="absolute bg-white border border-red-100 rounded-xl top-12 left-0 w-full p-2 shadow-xl z-50">
								{['paid', 'unpaid'].map((status) => (
									<TouchableOpacity
										key={status}
										className={`w-full p-2 rounded-lg ${
											selectedStatus === status ? 'bg-[#FF4863]' : 'bg-white'
										}`}
										onPress={() => {
											setSelectedStatus(status as 'paid' | 'unpaid');
											setIsModalVisible(false);
										}}
									>
										<Text
											className={`text-left text-lg capitalize ${
												selectedStatus === status
													? 'text-white'
													: 'text-slate-600'
											}`}
										>
											{status.replace('-', ' ')}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>

					<View className="gap-2 flex-1">
						<Text className="text-slate-900 tracking-tight">Paid at</Text>
						<CustomDatePicker
							displayDate
							displayDay
							currentDate={currentDate}
							setDate={setCurrentDate}
						/>
					</View>
				</View>

				<View className="px-6">
					<InputField
						label="Total"
						value={total}
						onChange={(event) => setTotal(event.nativeEvent.text)}
						keyboardType="number-pad"
						placeholder="Rp"
					/>
				</View>

				<View className="px-6 z-30">
					<Button
						onPress={handleSubmit}
						text={loading ? 'Saving your changes...' : 'Save your changes'}
						type="main"
						disabled={loading}
					/>
				</View>
			</View>
		</View>
	);
}
