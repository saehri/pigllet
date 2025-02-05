import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import CheckIcon from '@/assets/svg/check_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import ReceiptIcon from '@/assets/svg/receipt_long_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';

import {
	ExpenseContext,
	ExpenseContextTypes,
} from '@/context/ExpensesProvider';
import generateUniqueNumber from '@/utils/generate-unique-numbers';

export default function AddExpenseWithOCR() {
	const { saveExpenses } = useContext(ExpenseContext) as ExpenseContextTypes;

	const { id } = useLocalSearchParams();
	const [results, setResults] = useState<
		{ description: string; unit_price: number }[]
	>([]);

	async function getScanResult() {
		try {
			const response = await axios.get(
				`https://api.edenai.run/v2/workflow/76de1037-5340-4ee1-a797-ff2c150f4f2f/execution/${id}/`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization:
							'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzg4NWZhZmUtZGY2OC00ZWEyLWE1YjgtODQ1N2JiYjhhYWEwIiwidHlwZSI6ImFwaV90b2tlbiJ9.KQNnkoIVG4h7aTjvqUdTY35abRvhp9nBsVpK0UxuG0U',
					},
				}
			);

			const sr: any =
				response.data.content.results.VERYLASTFIELD.results[0].extracted_data[0]
					.item_lines;
			const finishData = sr.map((sr: any) => ({
				description: `${sr.description} x${sr.quantity}`,
				unit_price: sr.unit_price,
			}));

			setResults(finishData);
		} catch (error: any) {
			console.error('Error in getScanResult:', error);
			throw new Error(
				error.response?.data?.message || 'Failed to get scan result'
			);
		}
	}

	function saveData() {
		for (let i = 0; i < results.length; i++) {
			saveExpenses({
				description: results[i].description,
				id: generateUniqueNumber(),
				paid_at: new Date().toISOString(),
				total: results[i].unit_price,
				transaction_type: 'spending',
				wallet: { wallet_id: 1, wallet_name: 'Cash' },
			});
		}

		router.navigate('/(root)/(tabs)/expense');
	}

	return (
		<View className="pt-16 bg-[#FF2C4A] h-full gap-6">
			<View className="px-6 flex-row justify-between"></View>

			<View className="m-6 bg-white rounded-2xl">
				<View className="gap-1 p-6 border-b border-dashed border-slate-300 relative">
					<Text className="text-sm text-slate-600 text-center">
						OCR Queue ID
					</Text>
					<Text className="text-center text-2xl text-slate-900 font-bold">
						{id}
					</Text>

					<Text className="text-center text-sm text-slate-600 mt-6">
						Successfully added {results.length} item(s) to your expense record.
					</Text>

					<View className="absolute bg-[#FF2C4A] w-8 h-8 rounded-full -left-4 -bottom-4"></View>
					<View className="absolute bg-[#FF2C4A] w-8 h-8 rounded-full -right-4 -bottom-4"></View>
				</View>

				{results.length > 0 && (
					<View className="gap-8">
						{results.map((result, index) => (
							<View
								key={index}
								className={`flex-row justify-between p-6 w-full ${
									index === results.length - 1
										? 'border-none'
										: 'border-b border-dashed border-slate-200'
								}`}
							>
								<Text className="text-lg text-slate-900">
									{result.description}
								</Text>
								<Text className="text-lg text-slate-900">
									Rp{' '}
									{result.unit_price.toLocaleString('id-ID', {
										style: 'currency',
										currency: 'IDR',
									})}
								</Text>
							</View>
						))}
					</View>
				)}
			</View>

			{!results.length ? (
				<View className="items-center justify-center gap-2">
					<TouchableOpacity
						onPress={() => getScanResult()}
						className="w-12 h-12 rounded-full bg-blue-400 items-center justify-center"
					>
						<ReceiptIcon />
					</TouchableOpacity>

					<Text className="text-center text-sm w-64 text-white">
						Keep tapping the button until the scan result is showing up.
					</Text>
				</View>
			) : (
				<View className="items-center justify-center gap-2">
					<TouchableOpacity
						onPress={() => saveData()}
						className="w-12 h-12 rounded-full bg-green-500 items-center justify-center"
					>
						<CheckIcon />
					</TouchableOpacity>

					<Text className="text-center text-sm w-64 text-white">
						Save your data!
					</Text>
				</View>
			)}
		</View>
	);
}
