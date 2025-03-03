import { View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import TransactionCard from '../reusables/transaction-card';

export default function TransactionHistory() {
	return (
		<View style={{ marginTop: 24, gap: 12 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingHorizontal: 16,
				}}
			>
				<Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
					Transactions history
				</Text>

				<Button
					mode="text"
					icon="chevron-right"
					contentStyle={{
						flexDirection: 'row-reverse',
					}}
					compact
				>
					See all
				</Button>
			</View>

			<View>
				<TransactionCard type="expense" />
				<TransactionCard type="income" />
				<TransactionCard type="transfer" />
			</View>
		</View>
	);
}
