import { useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';

import NewTransferForm from '@/src/components/forms/transfer/new-transfer-form';

export default function NewIncome() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background, paddingTop: 59 }}
		>
			<NewTransferForm />
		</ScrollView>
	);
}
