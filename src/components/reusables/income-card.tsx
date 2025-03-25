import { useContext } from 'react';
import { Text, useTheme } from 'react-native-paper';
import { View, StyleSheet, Pressable } from 'react-native';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import { Accounts, Transaction, TransactionCategories } from '@/db/schema';

import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import { ArrowDownLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Props {
	category: TransactionCategories;
	data: Transaction;
	accounts: Accounts;
}

export default function IncomeCard({ category, data, accounts }: Props) {
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const theme = useTheme();
	const router = useRouter();

	const formattedDate = new Date(
		`${data.created_year}-${data.created_month}-${data.created_date}`
	).toLocaleDateString('en-US', { dateStyle: 'long', month: 'short' });

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
			>
				<ArrowDownLeft
					size={20}
					strokeWidth={1.5}
					color={theme.colors.onBackground}
				/>
			</Pressable>

			<Pressable
				style={styles.contentContainer}
				onPress={() =>
					router.push({
						pathname: '/transaction-detail',
						params: { id: data.id, type: data.type },
					})
				}
			>
				<View>
					<View style={styles.row}>
						<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
							{category.label}
						</Text>
					</View>

					<View
						style={{
							flexDirection: 'row',
							gap: 4,
							alignItems: 'center',
							width: 150,
						}}
					>
						<Text
							variant="labelLarge"
							style={[styles.bodyMedium]}
							numberOfLines={1}
						>
							Added to
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
							{accounts?.name}
						</Text>
					</View>
				</View>

				<View style={{ alignItems: 'flex-end' }}>
					<Text variant="bodyLarge" style={styles.bodyLarge}>
						{`${currentCurrencySymbol} ${data.amount.toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}`}
					</Text>

					<Text variant="labelLarge" style={styles.bodyMedium}>
						{formattedDate}
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
