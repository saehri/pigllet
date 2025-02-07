import { View } from 'react-native';
import { Text } from 'react-native-paper';
import TransactionCard from '../reusables/transaction-card';

export default function TodayTransaction() {
	return (
		<View style={{ marginTop: 24, gap: 16 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingHorizontal: 16,
				}}
			>
				<Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
					Today Transactions
				</Text>
				<Text variant="titleSmall" style={{ opacity: 0.8 }}>
					8 Feb 2025
				</Text>
			</View>

			<View>
				<TransactionCard type="expense" />
				<TransactionCard type="income" />
				<TransactionCard type="transfer" />
			</View>
		</View>
	);
}
