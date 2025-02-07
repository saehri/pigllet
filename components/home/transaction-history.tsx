import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import TransactionCard from '../reusables/transaction-card';

export default function TransactionHistory() {
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
					Transaction history
				</Text>

				<Text variant="titleSmall" style={{ opacity: 0.8 }}>
					See all
					<Icon size={16} source="chevron-right" />
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
