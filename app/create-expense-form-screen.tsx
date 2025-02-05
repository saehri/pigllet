import { ScrollView, Text } from 'react-native';

import RecieptOCR from '@/components/expense-screen/receipt-ocr';
import ScreenBackButton from '@/components/buttons/screen-back-button';
import RecordExpenseForm from '@/components/form/record-expense-form';

export default function CreateExpense() {
	return (
		<ScrollView className="pt-16 bg-white">
			<ScreenBackButton screenName="Record expense" />

			<RecieptOCR />

			<Text className="text-center mt-8 tex-sm tracking-tight">
				Or add manually
			</Text>

			<RecordExpenseForm />
		</ScrollView>
	);
}
