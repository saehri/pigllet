import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { CheckIcon, icons } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FlipInEasyY } from 'react-native-reanimated';
import moment from 'moment';

import * as schema from '@/db/schema';

import { fastSpatialEasing, formatCurrencyByCode } from '@/utils/utils';
import { cardBorderRadius, transactionColorMap } from '@/utils/utils';

import { useSelectedBudgets } from '@/store/useSelectedBudgets';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

import LucideIcons from '../reusables/lucide-icons';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

type Props = {
	data: { budget: schema.Budget; category: schema.Category };
	position: CardPositionsTypes;
};

function BudgetCard({ data, position }: Props) {
	const { budget, category } = data;

	const theme = useTheme();
	const router = useRouter();

	const { currentCurrencyCode, showFraction, accountingStyle, showSuffix } =
		useCurrencyStyle();
	const { selectedBudgets, setSelectedBudgets } = useSelectedBudgets();

	const isSelected = selectedBudgets.includes(budget.id!);

	// select the card
	const onSelect = () => {
		setSelectedBudgets([...selectedBudgets, budget.id!]);
	};

	// unselect the transaction card
	const onUnselect = () => {
		setSelectedBudgets(selectedBudgets.filter((id) => id !== budget.id!));
	};

	const cardRadiusStyle = useMemo(
		() => ({
			borderTopLeftRadius: cardBorderRadius[position].tl,
			borderTopRightRadius: cardBorderRadius[position].tr,
			borderBottomLeftRadius: cardBorderRadius[position].bl,
			borderBottomRightRadius: cardBorderRadius[position].br,
		}),
		[position]
	);

	const routeParams = useMemo(
		() => ({
			pathname: '/(root)/budget-detail' as any,
			params: {
				id: budget.id,
				categoryId: category.id,
				categoryLabel: category.label,
				budgetPeriod: budget.period,
				budgetLimit: budget.limit,
			},
		}),
		[budget.id, category.id]
	);

	const formattedAmount = useCallback(
		(amount: number) => {
			return formatCurrencyByCode(
				amount,
				currentCurrencyCode,
				showFraction,
				accountingStyle,
				showSuffix
			);
		},
		[currentCurrencyCode, showFraction, accountingStyle, showSuffix]
	);

	const handleButtonPress = () => {
		if (selectedBudgets.length) {
			if (isSelected) {
				return onUnselect();
			}

			return onSelect();
		}

		router.push(routeParams);
	};

	return (
		<Pressable
			style={[
				cardRadiusStyle,
				{
					overflow: 'hidden',
					borderWidth: 1,
					marginHorizontal: 16,
					marginBottom: 2,
					borderColor: isSelected
						? theme.colors.tertiary
						: theme.colors.elevation.level5,
				},
			]}
			onPress={handleButtonPress}
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
					style={[
						styles.iconContainer,
						{
							backgroundColor: theme.colors.elevation.level3,
							borderWidth: 1,
							borderColor: theme.colors.elevation.level1,
						},
					]}
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
							color={
								transactionColorMap[category.type as schema.TransactionType]
							}
							name={category.icon_name as keyof typeof icons}
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
							<Text style={styles.cardPrice} variant="bodyMedium">
								{formattedAmount(budget.limit)}
							</Text>
						</View>
					</View>

					<View style={styles.metaRow}>
						<View style={{ flex: 1 }}>
							<TransactionsCount
								budgetDate={budget.period}
								categoryId={category.id!}
							/>
						</View>

						<View style={styles.accountRow}>
							<CurrentSpending
								categoryId={category.id!}
								budgetDate={budget.period}
								limit={budget.limit}
							/>
						</View>
					</View>
				</View>
			</Surface>
		</Pressable>
	);
}

type TransactionsCount = {
	categoryId: number;
	budgetDate: string;
};

function TransactionsCount({ budgetDate, categoryId }: TransactionsCount) {
	const drizzleDb = useDrizzleDB();

	const getCurrentSpending = useMemo(() => {
		const whereConditions = [eq(schema.transactions.category_id, categoryId)];

		whereConditions.push(
			gte(
				schema.transactions.created_at,
				moment(budgetDate).startOf('month').format('YYYY-MM-DD')
			)
		);
		whereConditions.push(
			lte(
				schema.transactions.created_at,
				moment(budgetDate).endOf('month').format('YYYY-MM-DD')
			)
		);

		return drizzleDb
			.select({
				count: count(),
			})
			.from(schema.transactions)
			.where(and(...whereConditions));
	}, [categoryId, budgetDate]);

	const { data } = useLiveQuery(getCurrentSpending);
	const totalTransactions = data[0]?.count ?? 0;

	return (
		<Text
			variant="labelSmall"
			style={[styles.cardNote, styles.noteText]}
			numberOfLines={1}
		>
			{totalTransactions} transactions
		</Text>
	);
}

type CurrentSpendingProps = {
	categoryId: number;
	budgetDate: string;
	limit: number;
};

function CurrentSpending({
	categoryId,
	budgetDate,
	limit,
}: CurrentSpendingProps) {
	const drizzleDb = useDrizzleDB();

	const getCurrentSpending = useMemo(() => {
		const whereConditions = [eq(schema.transactions.category_id, categoryId)];

		whereConditions.push(
			gte(
				schema.transactions.created_at,
				moment(budgetDate).startOf('month').format('YYYY-MM-DD')
			)
		);
		whereConditions.push(
			lte(
				schema.transactions.created_at,
				moment(budgetDate).endOf('month').format('YYYY-MM-DD')
			)
		);

		return drizzleDb
			.select({
				totalExpense: sql<number>`COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'expense' THEN ${schema.transactions.amount} ELSE 0 END), 0)`,
			})
			.from(schema.transactions)
			.where(and(...whereConditions));
	}, [categoryId, budgetDate]);

	const { data } = useLiveQuery(getCurrentSpending);
	const totalExpense = data[0]?.totalExpense || 0;
	const spendingPercentage = (totalExpense / limit) * 100;

	const getStatus = (percentage: number) => {
		if (percentage === 100) return 'On track';
		if (percentage < 100) return 'Under budget';
		if (percentage > 100) return 'Over budget';
	};

	return (
		<Text
			variant="labelSmall"
			style={styles.cardNote}
			adjustsFontSizeToFit
			numberOfLines={1}
		>
			{spendingPercentage.toFixed(0)}% spent ·{getStatus(spendingPercentage)}
		</Text>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		paddingVertical: 9,
		paddingHorizontal: 12,
		paddingLeft: 8,
	},
	iconContainer: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 100,
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
		opacity: 0.7,
	},
});

export default memo(BudgetCard);

