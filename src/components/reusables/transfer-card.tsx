import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Text, useTheme } from 'react-native-paper';
import { View, StyleSheet, Pressable } from 'react-native';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import { Account, Transaction, Category } from '@/db/schema';

import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import { ArrowLeftRight, ArrowRight, Image } from 'lucide-react-native';

interface Props {
	category: Category;
	data: Transaction;
	accounts: Account;
	relatedAccount: Account;
	disableFirstButton?: boolean;
	disableSecondButton?: boolean;
	showDate?: boolean;
}

export default function TransferCard({
	category,
	data,
	accounts,
	relatedAccount,
	disableFirstButton = false,
	disableSecondButton = false,
	showDate,
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
				<ArrowLeftRight
					size={20}
					strokeWidth={1.5}
					color={theme.colors.onBackground}
				/>
			</Pressable>

			<Pressable
				onPress={() =>
					router.push({
						pathname: '/(root)/edit-transfer',
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
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<View style={styles.row}>
						<Text
							variant="bodyLarge"
							style={{
								fontFamily: 'Manrope-Regular',
								overflow: 'hidden',
							}}
							numberOfLines={1}
						>
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
					<View style={{ flex: 1 }}>
						{showDate && (
							<Text variant="labelLarge" style={styles.bodyMedium}>
								{new Date(data.created_at).toLocaleDateString('en-US', {
									dateStyle: 'medium',
								})}
							</Text>
						)}

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
									style={[styles.bodyMedium, { flex: 1, maxWidth: 100 }]}
									numberOfLines={1}
								>
									{data.note}
								</Text>
							)}
						</View>
					</View>

					<View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
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
								{accounts?.name || ''}
							</Text>
						</View>

						<ArrowRight
							size={14}
							strokeWidth={1}
							color={theme.colors.onBackground}
						/>

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
								{relatedAccount?.name || ''}
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
		paddingVertical: 10,
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
		fontFamily: 'Manrope-Regular',
	},
	bodyMedium: {
		letterSpacing: -0.1,
		fontFamily: 'Manrope-Light',
		opacity: 0.8,
	},
});

