import { memo, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import {
	ArrowRightLeftIcon,
	CheckIcon,
	ImageIcon,
	MinusIcon,
	MoveRight,
	PlusIcon,
} from 'lucide-react-native';
import Animated, { FlipInEasyY } from 'react-native-reanimated';

import moment from 'moment';

import { TransactionType } from '@/db/schema';
import { TransactionWithDetails } from '@/utils/group-transactions';

import {
	TRANSACTION_CARD_BR,
	transactionColorMap,
	formatCurrencyByCode,
	fastSpatialEasing,
} from '@/utils/utils';

import { useSelectedTransactions } from '@/store/useSelectedTransactions';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import LucideIcons from './lucide-icons';

type Props = {
	data: TransactionWithDetails;
	pressable?: boolean;
	showDate: boolean;
	position: CardPositionsTypes;
};

function TransactionCard({ data, position, showDate, pressable }: Props) {
	const { account, category, related_account, transaction } = data;

	const theme = useTheme();
	const router = useRouter();

	const { selectedTransactions, setSelectedTransactions } =
		useSelectedTransactions();
	const { currentCurrencyCode } = usePreferredCurrencyStore();

	// used to check whether the transaction card is selected or not
	const isSelected = selectedTransactions.includes(data.transaction.id!);

	// select the card
	const onSelect = () => {
		setSelectedTransactions([...selectedTransactions, data.transaction.id!]);
	};

	// unselect the transaction card
	const onUnselect = () => {
		setSelectedTransactions(
			selectedTransactions.filter((id) => id !== data.transaction.id!)
		);
	};

	const formattedAmount = useMemo(() => {
		return formatCurrencyByCode(transaction.amount, currentCurrencyCode);
	}, [transaction.amount, currentCurrencyCode]);

	const formattedDate = useMemo(() => {
		return moment(transaction.created_at).format('MMM D, YYYY');
	}, [transaction.created_at]);

	const routeParams = useMemo(
		() => ({
			pathname: `/(root)/edit-${transaction.type}` as any,
			params: {
				id: transaction.id as any,
				type: transaction.type,
				categoryId: category.id,
			},
		}),
		[transaction.id, transaction.type, category.id]
	);

	const cardRadiusStyle = useMemo(
		() => ({
			borderTopLeftRadius: TRANSACTION_CARD_BR[position].tl,
			borderTopRightRadius: TRANSACTION_CARD_BR[position].tr,
			borderBottomLeftRadius: TRANSACTION_CARD_BR[position].bl,
			borderBottomRightRadius: TRANSACTION_CARD_BR[position].br,
		}),
		[position]
	);

	return (
		<Pressable
			disabled={pressable}
			onPress={() => router.push(routeParams)}
			style={[
				cardRadiusStyle,
				{
					overflow: 'hidden',
					borderWidth: 1,
					borderColor: isSelected
						? theme.colors.tertiary
						: theme.colors.elevation.level5,
				},
			]}
		>
			<Surface
				mode="flat"
				elevation={5}
				style={[
					styles.container,
					{
						backgroundColor: isSelected
							? theme.colors.tertiaryContainer
							: theme.colors.elevation.level5,
					},
				]}
			>
				<Pressable
					style={styles.iconContainer}
					onPress={isSelected ? onUnselect : onSelect}
				>
					{isSelected ? (
						<Animated.View
							entering={FlipInEasyY.duration(500).easing(fastSpatialEasing)}
							style={[
								styles.checkIconBox,
								{ backgroundColor: theme.colors.tertiary },
							]}
						>
							<CheckIcon
								color={theme.colors.onTertiary}
								size={20}
								strokeWidth={1.5}
							/>
						</Animated.View>
					) : (
						<LucideIcons
							color={transactionColorMap[transaction.type as TransactionType]}
							name={category.icon_name as any}
							size={20}
						/>
					)}
				</Pressable>

				<View style={styles.contentContainer}>
					<View style={styles.row}>
						<Text
							numberOfLines={1}
							variant="bodyMedium"
							style={styles.cardLabel}
						>
							{category.label}
						</Text>

						<View style={styles.amountRow}>
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
								{formattedAmount}
							</Text>
						</View>
					</View>

					<View style={styles.metaRow}>
						<View style={{ flex: 1 }}>
							{showDate && (
								<Text variant="labelLarge" style={styles.cardNote}>
									{formattedDate}
								</Text>
							)}
							<View style={styles.noteRow}>
								{transaction.image && (
									<ImageIcon
										size={14}
										strokeWidth={1}
										color={theme.colors.onBackground}
									/>
								)}
								<Text
									variant="labelMedium"
									style={[styles.cardNote, styles.noteText]}
									numberOfLines={1}
								>
									{transaction.note || 'Undefined'}
								</Text>
							</View>
						</View>

						<View style={styles.accountRow}>
							<Text
								variant="labelMedium"
								style={styles.cardNote}
								adjustsFontSizeToFit
								numberOfLines={1}
							>
								{account.card_name}
							</Text>

							{related_account && (
								<MoveRight size={12} color={theme.colors.onSurface} />
							)}

							{related_account && (
								<Text
									variant="labelMedium"
									style={styles.cardNote}
									adjustsFontSizeToFit
									numberOfLines={1}
								>
									{related_account.card_name}
								</Text>
							)}
						</View>
					</View>
				</View>
			</Surface>
		</Pressable>
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
	checkIconBox: {
		borderRadius: 100,
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
		justifyContent: 'space-between',
	},
	amountRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
	},
	metaRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	accountRow: {
		flexDirection: 'row',
		gap: 6,
		alignItems: 'center',
	},
	noteRow: {
		flexDirection: 'row',
		gap: 4,
		alignItems: 'center',
	},
	noteText: {
		flex: 1,
		maxWidth: 150,
		fontStyle: 'italic',
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

export default memo(TransactionCard);

