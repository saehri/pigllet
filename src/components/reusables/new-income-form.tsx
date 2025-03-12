import { useState } from 'react';
import { ToastAndroid, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import SelectInput from '../forms/select-input';

const incomeCategories = [
	{ value: 'other', label: 'Other' },
	{ value: 'salary', label: 'Salary' },
	{ value: 'freelance', label: 'Freelance' },
	{ value: 'business-income', label: 'Business Income' },
	{ value: 'bonuses-and-commission', label: 'Bonuses & Commissions' },
	{ value: 'overtime-pay', label: 'Overtime Pay' },
	{ value: 'dividens', label: 'Dividens' },
	{ value: 'interest-income', label: 'Interest Income' },
	{ value: 'capital-gains', label: 'Capital Gains' },
	{ value: 'rental-income', label: 'Rental Income' },
	{ value: 'royalties', label: 'Royalties' },
	{ value: 'affiliate-marketing', label: 'Affiliate Marketing' },
	{ value: 'advertising', label: 'Advertising' },
	{ value: 'dropshipping', label: 'Dropshipping' },
	{ value: 'pension', label: 'Pension' },
	{ value: 'unemployment-benefits', label: 'Unemployment Benefits' },
	{ value: 'child-support', label: 'Child Support' },
	{ value: 'alimony', label: 'Alimony' },
	{ value: 'gifts-and-donations', label: 'Gifts & Donations' },
	{ value: 'lottery-and-gambling', label: 'Lottery & Gambling' },
	{ value: 'side-hustles', label: 'Side Hustles' },
];

type Props = {
	initialFormValue?: {
		selectedCategory: string;
		amount: string;
		note: string;
		from: string;
		to: string;
	};
};

export default function NewIncomeForm({ initialFormValue }: Props) {
	const [selectedCategory, setSelectedCategory] = useState(
		initialFormValue?.selectedCategory || 'other'
	);
	const [amount, setAmount] = useState(initialFormValue?.amount || '');
	const [note, setNote] = useState(initialFormValue?.note || '');
	const [from, setFrom] = useState(initialFormValue?.from || 'bank');
	const [to, setTo] = useState(initialFormValue?.from || 'cash');

	function handleSubmit() {
		if (Number(amount)) {
			console.log({ selectedCategory, amount, note });
			ToastAndroid.show('Record saved', ToastAndroid.CENTER);

			setSelectedCategory('other');
			setAmount('');
			setNote('');
			setFrom('bank');
		} else {
			ToastAndroid.show('Invalid amount', ToastAndroid.CENTER);
		}
	}

	return (
		<View style={{ padding: 16, gap: 12 }}>
			<View style={{ flexDirection: 'row', gap: 16 }}>
				<View style={{ flex: 1, gap: 12 }}>
					<Text variant="bodyLarge">Category</Text>
					<SelectInput
						data={incomeCategories}
						placeholder="Category"
						value={selectedCategory}
						handleSelect={setSelectedCategory}
						closeAfterSelect
					/>
				</View>

				<View style={{ flex: 1, gap: 12 }}>
					<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
						Amount
					</Text>

					<TextInput
						keyboardType="number-pad"
						contentStyle={{ fontFamily: 'Inter-Regular' }}
						onChangeText={setAmount}
						value={amount}
					/>
				</View>
			</View>

			<View style={{ flexDirection: 'row', gap: 16 }}>
				<View style={{ flex: 1, gap: 12 }}>
					<Text variant="bodyLarge">From</Text>
					<SelectInput
						data={[
							{ label: 'Bank', value: 'bank' },
							{ label: 'Cash', value: 'cash' },
						]}
						placeholder="Bank"
						value={from}
						handleSelect={setFrom}
						closeAfterSelect
					/>
				</View>
				<View style={{ flex: 1, gap: 12 }}>
					<Text variant="bodyLarge">To</Text>
					<SelectInput
						data={[
							{ label: 'Bank', value: 'bank' },
							{ label: 'Cash', value: 'cash' },
						]}
						placeholder="Cash"
						value={to}
						handleSelect={setTo}
						closeAfterSelect
					/>
				</View>
			</View>

			<View style={{ gap: 12, marginBottom: 24 }}>
				<Text variant="bodyLarge">Note</Text>
				<TextInput
					contentStyle={{ fontFamily: 'Inter-Regular' }}
					onChangeText={setNote}
					value={note}
				/>
			</View>

			<Button
				mode="contained"
				onPress={handleSubmit}
				disabled={!amount.length}
				labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
				style={{ borderRadius: 10 }}
			>
				Save record
			</Button>
		</View>
	);
}
