import { useContext } from 'react';
import { useRouter } from 'expo-router';
import {
	ArrowRightLeftIcon,
	ImageIcon,
	MinusIcon,
	PlusIcon,
} from 'lucide-react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { Pressable, StyleSheet, View } from 'react-native';

import { TransactionWithDetails } from '@/utils/group-transactions';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import TransactionIcons from './transaction-icons';
import { transactionColorMap } from '@/utils/utils';

type Props = {
	data: TransactionWithDetails;
	disableFirstButton: boolean;
	disableSecondButton: boolean;
	showDate: boolean;
	position: 'first' | 'middle' | 'last' | 'only';
};

export default function TransactionCard({
	data,
	disableFirstButton,
	disableSecondButton,
	showDate,
	position,
}: Props) {
	const router = useRouter();
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const { account, category, related_account, transaction } = data;

	return (
		<Surface
			mode="flat"
			elevation={3}
			style={[
				styles.container,
				{
					borderTopRightRadius:
						position === 'first'
							? 16
							: position === 'middle'
								? 6
								: position === 'only'
									? 16
									: 6,
					borderTopLeftRadius:
						position === 'first'
							? 16
							: position === 'middle'
								? 6
								: position === 'only'
									? 16
									: 6,
					borderBottomLeftRadius:
						position === 'first'
							? 6
							: position === 'middle'
								? 6
								: position === 'only'
									? 16
									: 16,
					borderBottomRightRadius:
						position === 'first'
							? 6
							: position === 'middle'
								? 6
								: position === 'only'
									? 16
									: 16,
				},
			]}
		>
			<Pressable
				style={styles.iconContainer}
				onPress={() =>
					router.push({
						pathname: '/(root)/transaction-by-category',
						params: {
							categoryId: data.category.id,
							categoryName: data.category.label,
						},
					})
				}
				disabled={disableFirstButton}
			>
				<TransactionIcons
					color={transactionColorMap[transaction.type]}
					icon={category.icon_name as any}
					size={20}
				/>
			</Pressable>

			<Pressable
				onPress={() =>
					router.push({
						pathname: `/(root)/edit-${transaction.type}` as any,
						params: {
							id: transaction.id as any,
							type: transaction.type,
							categoryId: category.id,
						},
					})
				}
				style={[styles.contentContainer]}
				disabled={disableSecondButton}
			>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={styles.row}>
						<Text
							numberOfLines={1}
							variant="bodyMedium"
							style={styles.cardLabel}
						>
							{category.label}
						</Text>
					</View>

					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
						{transaction.type === 'transfer' && (
							<ArrowRightLeftIcon
								size={14}
								strokeWidth={1}
								color={theme.colors.onBackground}
							/>
						)}

						{transaction.type === 'income' && (
							<PlusIcon
								size={14}
								strokeWidth={1}
								color={theme.colors.onBackground}
							/>
						)}

						{transaction.type === 'expense' && (
							<MinusIcon
								size={14}
								strokeWidth={1}
								color={theme.colors.onBackground}
							/>
						)}

						<Text style={styles.cardPrice} variant="bodyMedium">
							{`${currentCurrencySymbol} ${data.transaction.amount.toLocaleString(
								getLocaleByCurrencySymbol(currentCurrencySymbol)
							)}`}
						</Text>
					</View>
				</View>

				<View
					style={{
						alignItems: showDate ? 'center' : 'flex-end',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<View style={{ flex: 1 }}>
						{showDate && (
							<Text variant="labelLarge" style={styles.cardNote}>
								{new Date(transaction.created_at).toLocaleDateString('en-US', {
									dateStyle: 'medium',
								})}
							</Text>
						)}

						<View
							style={{
								flexDirection: 'row',
								gap: 4,
								alignItems: 'center',
							}}
						>
							{transaction.image && (
								<ImageIcon
									size={14}
									strokeWidth={1}
									color={theme.colors.onBackground}
								/>
							)}

							<Text
								variant="labelMedium"
								style={[
									styles.cardNote,
									{ flex: 1, maxWidth: 150, fontStyle: 'italic' },
								]}
								numberOfLines={1}
							>
								{transaction.note || 'Undefined'}
							</Text>
						</View>
					</View>

					<View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
						<Text
							variant="labelMedium"
							style={styles.cardNote}
							adjustsFontSizeToFit
							numberOfLines={1}
						>
							{account.name}
						</Text>

						{related_account && (
							<Text
								variant="labelMedium"
								style={styles.cardNote}
								adjustsFontSizeToFit
								numberOfLines={1}
							>
								to {related_account.name}
							</Text>
						)}
					</View>
				</View>
			</Pressable>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		paddingVertical: 9,
		paddingHorizontal: 12,
	},
	iconContainer: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	contentContainer: {
		flex: 1,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
		flex: 1,
	},
	bodyLarge: {
		fontFamily: 'Manrope-Medium',
	},
	cardLabel: {
		fontFamily: 'Manrope-SemiBold',
	},
	cardPrice: {
		fontFamily: 'Manrope-SemiBold',
		letterSpacing: -0.2,
	},
	cardNote: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.9,
	},
});

