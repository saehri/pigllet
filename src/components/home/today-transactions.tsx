import { useState } from 'react';
import { Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import TransactionCard from '../reusables/transaction-card';

export default function TodayTransaction() {
	const [todayDate] = useState(new Date());

	return (
		<View style={styles.container}>
			<View
				style={styles.headerContainer}
			>
				<Text variant="titleLarge" style={styles.title}>
					Today transactions
				</Text>

				<Text variant="titleSmall" style={styles.subtitle}>
					{todayDate.toLocaleDateString('id-ID', {
						dateStyle: 'medium',
					})}
				</Text>
			</View>

			<View>
				<TransactionCard type="expense" />
				<TransactionCard type="expense" />
				<TransactionCard type="expense" />
				<TransactionCard type="expense" />
				<TransactionCard type="income" />
				<TransactionCard type="transfer" />
				<TransactionCard type="transfer" />
			</View>
		</View>
	);
}


const styles = StyleSheet.create({
	container: {
		marginTop: 28, gap: 10
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	title: {
		fontFamily: 'Inter-Black'
	},
	subtitle: {
		fontFamily: 'Inter-Regular',
		opacity: 0.8
	}
})