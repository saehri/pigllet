import { useContext } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import {
	ExpenseContext,
	ExpenseContextTypes,
} from '@/context/ExpensesProvider';

import CloseIcon from '@/assets/svg/close_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import DeleteForeverIcon from '@/assets/svg/delete_forever_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import EditIcon from '@/assets/svg/edit_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';

export default function DetailsScreen() {
	const { id } = useLocalSearchParams();
	const { getExpenseById, deleteExpenseById } = useContext(
		ExpenseContext
	) as ExpenseContextTypes;

	const expense = getExpenseById(Number(id));

	const formatedDate = new Date(expense.paid_at).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

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
						deleteExpenseById(Number(id));

						router.back();
					},
					style: 'destructive',
				},
			],
			{
				cancelable: true,
			}
		);

	return (
		<View className="pt-16 bg-[#FF2C4A] h-full gap-6">
			<View className="px-6 flex-row justify-between">
				<TouchableOpacity
					onPress={() => router.back()}
					className="w-12 h-12 items-center justify-center rounded-full border border-white"
				>
					<CloseIcon />
				</TouchableOpacity>

				<View className="gap-4 flex-row">
					<TouchableOpacity
						onPress={() => router.replace(`/expense-edit/${id}`)}
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
					<Text className="text-center text-2xl text-slate-900 font-bold">
						{expense.description}
					</Text>

					<Text className="mt-4 capitalize text-sm text-slate-600 bg-slate-200 rounded-full py-1 px-4 text-center">
						{expense.transaction_type}
					</Text>

					<View className="absolute bg-[#FF2C4A] w-8 h-8 rounded-full -left-4 -bottom-4"></View>
					<View className="absolute bg-[#FF2C4A] w-8 h-8 rounded-full -right-4 -bottom-4"></View>
				</View>

				<View className="gap-8">
					{expense.category && (
						<View className="flex-row justify-between p-6 w-full border-b border-slate-100">
							<Text className="text-lg text-slate-900">Category</Text>
							<Text className="text-lg text-slate-900">{expense.category}</Text>
						</View>
					)}

					<View className="flex-row justify-between p-6 w-full border-b border-dashed border-slate-200">
						<Text className="text-lg text-slate-900">Total</Text>
						<Text className="text-lg text-slate-900">
							Rp {expense.total ? expense.total.toLocaleString('id-IDR') : 0}
						</Text>
					</View>

					<View className="flex-row justify-between pb-6 px-6 w-full border-b border-dashed border-slate-200">
						<Text className="text-lg text-slate-900">Added to wallet</Text>
						<Text className="text-lg text-slate-900">
							{expense.wallet.wallet_name}
						</Text>
					</View>

					<View className="flex-row justify-between px-6 pb-6">
						<Text className="text-lg text-slate-900">Added at</Text>
						<Text className="text-lg text-slate-900">{formatedDate}</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
