import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Text, useTheme } from 'react-native-paper';
import { View, StyleSheet, Pressable } from 'react-native';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import { Transaction, TransactionCategories } from '@/db/schema';

import TransactionIcons from './transaction-icons';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

type TransactionWithoutImage = Omit<Transaction, 'image'>;

interface Props {
	category: TransactionCategories;
	data: TransactionWithoutImage;
	accountName?: string;
	disableFirstButton?: boolean;
	disableSecondButton?: boolean;
}

export default function ExpenseCard({
	category,
	data,
	accountName = '',
	disableFirstButton = false,
	disableSecondButton = false,
}: Props) {
	const router = useRouter();
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	return (
		<View style={styles.container}>
			<Pressable
				style={styles.iconContainer}
				onPress={() =>
					router.push({
						pathname: '/(root)/transaction-by-category',
						params: { categoryId: category.id, categoryName: category.label },
					})
				}
				disabled={disableFirstButton}
			>
				<TransactionIcons icon={category.icon_name as any} />
			</Pressable>

			<Pressable
				onPress={() =>
					router.push({
						pathname: '/(root)/edit-expense',
						params: {
							id: data.id as any,
							type: data.type,
							categoryId: data.category_id,
						},
					})
				}
				style={[styles.contentContainer]}
				disabled={disableSecondButton}
			>
				<View style={{ flex: 1, paddingRight: 24 }}>
					<View style={styles.row}>
						<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
							{category.label}
						</Text>
					</View>

					<Text
						variant="labelLarge"
						style={[styles.bodyMedium, { flex: 1, maxWidth: 150 }]}
						numberOfLines={1}
					>
						{data.note}
					</Text>
				</View>

				<View style={{ alignItems: 'flex-end' }}>
					<Text style={styles.bodyLarge} variant="bodyLarge">
						{`${currentCurrencySymbol} ${data.amount.toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}`}
					</Text>

					<Text
						variant="labelLarge"
						style={[
							styles.bodyMedium,
							{
								backgroundColor: theme.colors.elevation.level3,
								paddingHorizontal: 5,
								borderRadius: 6,
							},
						]}
						numberOfLines={1}
					>
						{accountName}
					</Text>
				</View>
			</Pressable>
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
		alignItems: 'center',
	},
	labelContainer: {
		backgroundColor: '#ff0000',
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
