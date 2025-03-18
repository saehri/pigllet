import { useContext } from 'react';
import { Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import { type Expense, type ExpenseCategory, type Accounts } from '@/db/schema';

import TransactionIcons from './transaction-icons';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

interface Props {
	category: ExpenseCategory;
	data: Expense;
	account: Accounts;
}

export default function ExpenseCard({ account, category, data }: Props) {
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const formattedDate = new Date(data.created_date).toLocaleDateString(
		'en-US',
		{ dateStyle: 'long', month: 'short' }
	);

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<TransactionIcons icon={category.icon_name as any} />
			</View>

			<View style={styles.contentContainer}>
				<View style={styles.labelContainer}>
					<View style={styles.row}>
						<Text variant="bodyLarge">{category.label}</Text>
					</View>

					<Text
						variant="labelLarge"
						style={[styles.bodyMedium, { width: 150 }]}
						numberOfLines={1}
					>
						{data.note}
					</Text>
				</View>

				<View style={styles.labelContainer}>
					<Text variant="bodyLarge" style={styles.bodyLarge}>
						{`${currentCurrencySymbol} ${data.amount.toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}`}
					</Text>

					<Text variant="labelLarge" style={styles.bodyMedium}>
						{formattedDate}
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 12,
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	iconContainer: {
		width: 50,
		height: 50,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(153, 153, 153, 0.3)',
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	labelContainer: {
		flexDirection: 'column',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
		flex: 1,
	},
	bodyLarge: {
		letterSpacing: -0.1,
		fontFamily: 'Inter-Regular',
	},
	bodyMedium: {
		letterSpacing: -0.1,
		fontFamily: 'Inter-Light',
		opacity: 0.8,
	},
});
