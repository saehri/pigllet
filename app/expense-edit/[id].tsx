import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import {
	ExpenseContext,
	ExpenseContextTypes,
} from '@/context/ExpensesProvider';

import CloseIcon from '@/assets/svg/close_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import DeleteForeverIcon from '@/assets/svg/delete_forever_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import EditIcon from '@/assets/svg/edit_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import InputField from '@/components/form/input-field';
import CustomDatePicker from '@/components/custom-date-picker';
import Select from '@/components/form/select';
import WalletSelector from '@/components/form/wallet-selector';
import Button from '@/components/buttons/custom-button';

export default function DetailsScreen() {
	const { id } = useLocalSearchParams();
	const { loading, getExpenseById, deleteExpenseById, updateExpenseData } =
		useContext(ExpenseContext) as ExpenseContextTypes;

	const expense = getExpenseById(Number(id));

	const [currentDate, setCurrentDate] = useState<Date>(
		new Date(expense.paid_at)
	);
	const [selectedType, setSelectedType] = useState<string>(
		expense.transaction_type
	);
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
		expense.category
	);
	const [selectedWallet, setSelectedWallet] = useState<{
		wallet_id: number;
		wallet_name: string;
	}>(expense.wallet);
	const [description, setDecription] = useState<string>(expense.description);
	const [total, setTotal] = useState<string>(expense.total.toString());

	async function handleSubmit() {
		const response: any = await updateExpenseData(
			{
				description: description,
				id: Number(id),
				paid_at: currentDate.toISOString(),
				transaction_type: selectedType as any,
				category: selectedType === 'income' ? undefined : selectedCategory,
				wallet: selectedWallet,
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
						style: 'cancel',
					},
				],
				{
					cancelable: false,
				}
			);
		}
	}

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

			<View className="py-4 m-2 rounded-2xl mt-6 bg-white gap-6">
				<View className="px-6">
					<InputField
						label="Description"
						onChange={(event) => setDecription(event.nativeEvent.text)}
						placeholder="Mie goreng"
						value={description}
					/>
				</View>

				<View className="flex-row gap-4 px-6">
					<View
						className={`gap-2 relative ${
							selectedType === 'spending' ? 'w-1/2' : 'w-full'
						}`}
					>
						<Text className="text-slate-900 tracking-tight">Type</Text>

						<Select
							selectItems={['income', 'spending']}
							selected={selectedType}
							setSelected={setSelectedType}
						/>
					</View>

					{selectedType !== 'income' && (
						<View className="gap-2 relative flex-1">
							<Text className="text-slate-900 tracking-tight">Category</Text>

							<Select
								selectItems={['Necessity', 'Food', 'Healthcare']}
								selected={selectedCategory as string}
								setSelected={
									setSelectedCategory as Dispatch<SetStateAction<string>>
								}
							/>
						</View>
					)}
				</View>

				<View className="gap-2 flex-row px-6">
					<View className="gap-2 w-1/2 relative">
						<Text className="text-slate-900 tracking-tight">Date</Text>

						<CustomDatePicker
							displayDate
							displayDay
							currentDate={currentDate}
							setDate={setCurrentDate}
							maximumDate={new Date()}
						/>
					</View>

					<View className="gap-2 relative flex-1">
						<InputField
							label="Total"
							onChange={(event) => setTotal(event.nativeEvent.text)}
							keyboardType="number-pad"
							placeholder="Rp"
							value={total}
						/>
					</View>
				</View>

				<WalletSelector
					selectedWallet={selectedWallet}
					setSelectedWallet={setSelectedWallet}
				/>

				<View className="px-6">
					<Button
						onPress={() => handleSubmit()}
						text={loading ? 'Saving your changes...' : 'Save your changes'}
						type="main"
						disabled={loading}
					/>
				</View>
			</View>
		</View>
	);
}
