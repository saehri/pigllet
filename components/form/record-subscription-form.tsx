import { View, Text, TouchableOpacity } from 'react-native';
import InputField from './input-field';
import { useContext, useState } from 'react';
import CustomDatePicker from '../custom-date-picker';
import Button from '../buttons/custom-button';

import ArrowRightIcon from '@/assets/svg/arrow/keyboard-arrow-right.svg';
import ArrowDownIcon from '@/assets/svg/arrow/keyboard-arrow-down.svg';
import {
	SubscriptionContext,
	SubscriptionContextTypes,
	SubscriptionDataTypes,
} from '@/context/SubscriptionProvider';
import { useRouter } from 'expo-router';
import generateUniqueNumber from '@/utils/generate-unique-numbers';

export default function RecordSubscriptionForm() {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [selectedStatus, setSelectedStatus] = useState<'paid' | 'unpaid'>(
		'unpaid'
	);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [description, setDescription] = useState<string>('');
	const [total, setTotal] = useState<string>('0');

	const { loading, saveSubscription } = useContext(
		SubscriptionContext
	) as SubscriptionContextTypes;

	const router = useRouter();

	const handleSubmit = () => {
		if (!description.trim() || !total.trim()) {
			alert('Please fill in all the fields.');
			return;
		}

		const subscription: SubscriptionDataTypes = {
			id: generateUniqueNumber(),
			description: description,
			due_date: currentDate.toISOString(),
			is_paid: selectedStatus,
			total: Number(total),
		};

		saveSubscription(subscription);

		setDescription('');
		setTotal('0');
		setSelectedStatus('paid');
		setCurrentDate(new Date());

		router.back();
	};

	return (
		<View className="pt-8 gap-6">
			<View className="px-6">
				<InputField
					label="Description"
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

			<View className="px-6 z-30">
				<InputField
					label="Total"
					onChange={(event) => setTotal(event.nativeEvent.text)}
					keyboardType="number-pad"
					placeholder="Rp"
				/>
			</View>

			<View className="px-6">
				<Button
					onPress={handleSubmit}
					text={loading ? 'Adding your record...' : 'Record your subscription'}
					type="main"
					disabled={loading}
				/>
			</View>
		</View>
	);
}
