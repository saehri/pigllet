import { ScrollView } from 'react-native';

import NewTransferForm from '@/src/components/forms/transfer/new-transfer-form';

export default function NewIncome() {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingTop: 60 }}
		>
			<NewTransferForm />
		</ScrollView>
	);
}

