import { Pressable, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';
import { useContext } from 'react';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import { useRouter } from 'expo-router';

interface BudgetExtended extends schema.Budget {
	category: schema.Category;
}

type Props = {
	data: BudgetExtended;
};

export default function BudgetCard({ data }: Props) {
	const theme = useTheme();
	const router = useRouter();

	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	return (
		<Pressable
			style={{ marginBottom: 12 }}
			onPress={() =>
				router.push({
					pathname: '/(root)/edit-budget',
					params: {
						id: data.id as any,
						categoryId: data.category_id,
					},
				})
			}
		>
			<Surface
				elevation={3}
				style={{
					borderWidth: 1,
					borderColor: theme.colors.outlineVariant,
					padding: 16,
					marginHorizontal: 16,
					borderRadius: 16,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 12,
					}}
				>
					<Text
						style={{ fontFamily: 'Inter-Medium' }}
						numberOfLines={1}
						variant="titleMedium"
					>
						{data.category.label}
					</Text>

					<Text
						style={{ fontFamily: 'Inter-Regular' }}
						numberOfLines={1}
						variant="titleMedium"
					>
						{new Date(data.period).toLocaleDateString('en-US', {
							month: 'short', // or 'short' for abbreviated month
							year: 'numeric',
						})}
					</Text>
				</View>

				<View
					style={{
						borderColor: theme.colors.outlineVariant,
						borderWidth: 1,
						borderRadius: 10,
					}}
				>
					<View
						style={{
							padding: 8,
							borderRadius: 8,
							flex: 1,
							alignItems: 'center',
							borderBottomWidth: 1,
							borderColor: theme.colors.outlineVariant,
						}}
					>
						<Text style={{ fontFamily: 'Inter-Regular' }} variant="labelLarge">
							Current{' '}
							{`${currentCurrencySymbol} ${data.current_spending.toLocaleString(
								getLocaleByCurrencySymbol(currentCurrencySymbol)
							)}`}
						</Text>
					</View>

					<View
						style={{
							padding: 8,
							borderRadius: 8,
							flex: 1,
							alignItems: 'center',
						}}
					>
						<Text style={{ fontFamily: 'Inter-Regular' }} variant="labelLarge">
							Max{' '}
							{`${currentCurrencySymbol} ${data.max_spending.toLocaleString(
								getLocaleByCurrencySymbol(currentCurrencySymbol)
							)}`}
						</Text>
					</View>

					<View
						style={{
							padding: 8,
							borderRadius: 8,
							flex: 1,
							alignItems: 'center',
							borderTopWidth: 1,
							borderColor: theme.colors.outlineVariant,
						}}
					>
						<Text style={{ fontFamily: 'Inter-Regular' }} variant="labelLarge">
							Remaining{' '}
							{`${currentCurrencySymbol} ${(
								data.max_spending - data.current_spending
							).toLocaleString(
								getLocaleByCurrencySymbol(currentCurrencySymbol)
							)}`}
						</Text>
					</View>
				</View>
			</Surface>
		</Pressable>
	);
}

