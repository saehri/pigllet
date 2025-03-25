import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import {
	Button,
	Modal,
	Portal,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';
import { useCallback, useState } from 'react';

import { Plus, X } from 'lucide-react-native';
import SelectInput from '../forms/select-input';

import { expenseCategories } from '@/constants/expense-category';
const selectableExpenseCategories = expenseCategories.map((cat) => ({
	value: cat.category,
	label: cat.category,
}));

export default function BudgetFormModal() {
	const theme = useTheme();
	const [visible, setVisible] = useState<boolean>(false);

	const showModal = useCallback(() => setVisible(true), []);
	const hideModal = useCallback(() => setVisible(false), []);

	return (
		<>
			<Portal>
				<Modal visible={visible} onDismiss={hideModal} style={styles.modal}>
					<View
						style={[
							styles.modalContent,
							{
								backgroundColor: theme.colors.background,
								borderColor: theme.colors.outlineVariant,
							},
						]}
					>
						<View
							style={[
								styles.modalHeader,
								{ borderColor: theme.colors.outlineVariant },
							]}
						>
							<Text variant="titleMedium" style={styles.title}>
								Add budget
							</Text>

							<Button onPress={hideModal} compact>
								<X size={20} color={theme.colors.onBackground} />
							</Button>
						</View>

						<Form />
					</View>
				</Modal>
			</Portal>

			<Button onPress={showModal}>
				<Plus strokeWidth={1.5} color={theme.colors.onBackground} size={24} />
			</Button>
		</>
	);
}

type FormProps = {
	category: keyof ExpenseCategoryIconCatalog;
};

function Form() {
	const [selectedPeriod, setSelectedPeriod] = useState('other');
	const [selectedCategory, setSelectedCategory] = useState('other');
	const [amount, setAmount] = useState('');
	const [note, selectedNote] = useState('');

	function handleSubmit() {
		Alert.alert(
			'Budget created successfully!',
			'You now can see your budget on the homescreen.'
		);
	}

	return (
		<View style={{ padding: 16, gap: 12 }}>
			<View style={{ flexDirection: 'row', gap: 16 }}>
				<View style={{ flex: 1, gap: 12 }}>
					<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
						Period
					</Text>
					<SelectInput
						data={[
							{ label: 'Monthly', value: 'monthly' },
							{ label: 'Weekly', value: 'weekly' },
							{ label: 'Other', value: 'other' },
						]}
						placeholder="Other"
						value={selectedPeriod}
						handleSelect={setSelectedPeriod}
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

			<View style={{ gap: 12 }}>
				<Text variant="bodyLarge">Category</Text>
				<SelectInput
					data={selectableExpenseCategories}
					placeholder="Category"
					value={selectedCategory}
					handleSelect={setSelectedCategory}
					closeAfterSelect
				/>
			</View>

			<View style={{ gap: 12, marginBottom: 24 }}>
				<Text variant="bodyLarge">Note</Text>
				<TextInput
					contentStyle={{ fontFamily: 'Inter-Regular' }}
					onChangeText={selectedNote}
				/>
			</View>

			<Button
				mode="contained"
				disabled={!amount.length}
				onPress={handleSubmit}
				labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
				style={{ borderRadius: 10 }}
			>
				Create budget
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	modal: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(17, 17, 17, .3)',
	},
	modalContent: {
		width: Dimensions.get('screen').width,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		borderWidth: 1,
		borderBottomWidth: 0,
		bottom: -4,
	},
	modalHeader: {
		paddingLeft: 16,
		paddingTop: 12,
		paddingBottom: 8,
		paddingRight: 8,
		borderBottomWidth: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	title: {
		fontFamily: 'Inter-Regular',
		textTransform: 'capitalize',
	},
});
