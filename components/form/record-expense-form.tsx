import { useContext, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import Button from '../buttons/custom-button';
import CustomDatePicker from '../custom-date-picker';
import InputField from './input-field';

import {
	ExpenseContext,
	ExpenseContextTypes,
} from '@/context/ExpensesProvider';
import Select from './select';
import WalletSelector from './wallet-selector';
import { router } from 'expo-router';
import generateUniqueNumber from '@/utils/generate-unique-numbers';

export default function RecordExpenseForm() {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [selectedType, setSelectedType] = useState<string>('spending');
	const [selectedCategory, setSelectedCategory] = useState<string>('Food');
	const [selectedWallet, setSelectedWallet] = useState<{
		wallet_id: number;
		wallet_name: string;
	}>({ wallet_id: 1, wallet_name: 'Cash' });
	const [description, setDecription] = useState<string>('');
	const [total, setTotal] = useState<string>('0');

	const { loading, saveExpenses } = useContext(
		ExpenseContext
	) as ExpenseContextTypes;

	async function handleSubmit() {
		const response: any = await saveExpenses({
			description: description,
			id: generateUniqueNumber(),
			paid_at: currentDate.toISOString(),
			transaction_type: selectedType as any,
			category: selectedType === 'income' ? undefined : selectedCategory,
			wallet: selectedWallet,
			total: Number(total),
		});

		if (response.success) {
			Alert.alert(
				'Expense recorded uccessfully!',
				'Your expense now recorded.',
				[
					{
						text: 'Back',
						style: 'cancel',
						onPress: () => router.back(),
					},
					{
						text: 'Add more record',
						style: 'default',
					},
				],
				{
					cancelable: true,
				}
			);
		}
	}

	return (
		<View className="pt-8 gap-6">
			<View className="px-6">
				<InputField
					label="Description"
					onChange={(event) => setDecription(event.nativeEvent.text)}
					placeholder="Mie goreng"
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
							selectItems={[
								'Food',
								'Cosmetics',
								'Healthcare',
								'Necessity',
								'Gifts',
								'Education',
								'Loan',
								'Deposit',
							]}
							selected={selectedCategory}
							setSelected={setSelectedCategory}
						/>
					</View>
				)}
			</View>

			<View className="gap-2 flex-row flex-1 px-6">
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
					text={loading ? 'Adding your record...' : 'Record your expense'}
					type="main"
					disabled={loading}
				/>
			</View>
		</View>
	);
}
