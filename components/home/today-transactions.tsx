import { useState } from 'react';

import { View } from 'react-native';
import { Text } from 'react-native-paper';
import TransactionCard from '../reusables/transaction-card';

export default function TodayTransaction() {
	const [todayDate] = useState(new Date());

	return (
		<View style={{ marginTop: 36, gap: 16 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingHorizontal: 16,
				}}
			>
				<Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
					Today transactions
				</Text>
				<Text variant="titleSmall" style={{ opacity: 0.8 }}>
					{todayDate.toLocaleDateString('id-ID', {
						dateStyle: 'medium',
					})}
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
