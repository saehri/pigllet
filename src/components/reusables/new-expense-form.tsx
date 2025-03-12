import { useState } from 'react';
import { expenseCategories } from '@/constants/expense-category';
import { ToastAndroid, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import SelectInput from '../forms/select-input';

const selectableExpenseCategories = expenseCategories.map((cat) => ({
	value: cat.category,
	label: cat.category,
}));

type Props = {
	initialFormValue?: {
		selectedCategory: string;
		amount: string;
		note: string;
		from: string;
	};
};

export default function NewExpenseForm({ initialFormValue }: Props) {
	const [selectedCategory, setSelectedCategory] = useState(
		initialFormValue?.selectedCategory || 'other'
	);
	const [amount, setAmount] = useState(initialFormValue?.amount || '');
	const [note, setNote] = useState(initialFormValue?.note || '');
	const [from, setFrom] = useState(initialFormValue?.from || 'cash');

	function handleSubmit() {
		if (Number(amount)) {
			console.log({ selectedCategory, amount, note });
			ToastAndroid.show('Record saved', ToastAndroid.CENTER);

			setSelectedCategory('other');
			setAmount('');
			setNote('');
			setFrom('cash');
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
						data={selectableExpenseCategories}
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

			<View style={{ flex: 1, gap: 12 }}>
				<Text variant="bodyLarge">From</Text>
				<SelectInput
					data={[{ label: 'Cash', value: 'cash' }]}
					placeholder="Wallet"
					value={from}
					handleSelect={setFrom}
					closeAfterSelect
				/>
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
