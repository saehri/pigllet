import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Text, useTheme } from 'react-native-paper';
import { View, StyleSheet, Pressable } from 'react-native';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import { Accounts, Transaction, TransactionCategories } from '@/db/schema';

import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import { ArrowDownLeft, Image } from 'lucide-react-native';

interface Props {
	category: TransactionCategories;
	data: Transaction;
	accounts: Accounts;
	disableFirstButton?: boolean;
	disableSecondButton?: boolean;
}

export default function IncomeCard({
	category,
	data,
	accounts,
	disableFirstButton = false,
	disableSecondButton = false,
}: Props) {
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const theme = useTheme();
	const router = useRouter();

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
				<ArrowDownLeft
					size={20}
					strokeWidth={1.5}
					color={theme.colors.onBackground}
				/>
			</Pressable>

			<Pressable
				onPress={() =>
					router.push({
						pathname: '/(root)/edit-income',
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
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={styles.row}>
						<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
							{category.label}
						</Text>
					</View>

					<Text style={styles.bodyLarge} variant="bodyLarge">
						{`${currentCurrencySymbol} ${data.amount.toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}`}
					</Text>
				</View>

				<View
					style={{
						alignItems: 'flex-end',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							gap: 8,
							alignItems: 'center',
						}}
					>
						{data.image && (
							<Image
								size={14}
								strokeWidth={1}
								color={theme.colors.onBackground}
							/>
						)}

						{data.note && (
							<Text
								variant="labelLarge"
								style={[styles.bodyMedium, { flex: 1, maxWidth: 150 }]}
								numberOfLines={1}
							>
								{data.note}
							</Text>
						)}
					</View>

					<View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
						<Text variant="labelLarge" style={styles.bodyMedium}>
							Added to
						</Text>

						<View
							style={{
								maxWidth: 80,
								backgroundColor: theme.colors.elevation.level3,
								paddingHorizontal: 5,
								borderRadius: 6,
							}}
						>
							<Text
								variant="labelLarge"
								style={styles.bodyMedium}
								adjustsFontSizeToFit
								numberOfLines={1}
							>
								{accounts?.name}
							</Text>
						</View>
					</View>
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
