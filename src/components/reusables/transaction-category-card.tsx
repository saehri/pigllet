import { memo } from 'react';
import { useRouter } from 'expo-router';
import { CheckIcon, icons } from 'lucide-react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FlipInEasyY } from 'react-native-reanimated';
import {
	GestureResponderEvent,
	Pressable,
	StyleSheet,
	View,
} from 'react-native';

import { Category, TransactionType } from '@/db/schema';
import {
	fastSpatialEasing,
	cardBorderRadius,
	transactionColorMap,
} from '@/utils/utils';

import { useSelectedCategory } from '@/store/useSelectedCategory';

import LucideIcons from './lucide-icons';

type Props = {
	data: Category;
	position: CardPositionsTypes;
};

function TransactionCategoryCard({ data, position }: Props) {
	const theme = useTheme();
	const router = useRouter();

	const { selectedCategories, setSelectedCategories } = useSelectedCategory();

	function selectCategory(ev: GestureResponderEvent) {
		ev.preventDefault();
		setSelectedCategories([...selectedCategories, data.id as number]);
	}

	function unselectCategory(ev: GestureResponderEvent) {
		ev.preventDefault();
		setSelectedCategories(selectedCategories.filter((id) => id != data.id));
	}

	const isSelected = selectedCategories.includes(data.id!);

	const handleButtonPress = (ev: GestureResponderEvent) => {
		if (selectedCategories.length) {
			if (isSelected) {
				return setSelectedCategories(
					selectedCategories.filter((id) => id != data.id)
				);
			}

			return setSelectedCategories([...selectedCategories, data.id as number]);
		}

		router.push({
			pathname: '/category-form',
			params: { id: data.id, formAction: 'edit', categType: data.type },
		});
	};

	return (
		<Pressable disabled={Boolean(data.is_default)} onPress={handleButtonPress}>
			<Surface
				mode="flat"
				elevation={3}
				style={[
					styles.card,
					{
						borderTopLeftRadius: cardBorderRadius[position].tl,
						borderTopRightRadius: cardBorderRadius[position].tr,
						borderBottomLeftRadius: cardBorderRadius[position].bl,
						borderBottomRightRadius: cardBorderRadius[position].br,
						borderColor: isSelected
							? theme.colors.tertiary
							: theme.colors.elevation.level3,
						backgroundColor: isSelected
							? theme.colors.tertiaryContainer
							: theme.colors.elevation.level3,
					},
				]}
			>
				<View style={styles.content}>
					<Pressable
						style={styles.checkIconBox}
						onPress={isSelected ? unselectCategory : selectCategory}
						disabled={Boolean(data.is_default)}
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
								color={transactionColorMap[data.type as TransactionType]}
								name={data.icon_name as keyof typeof icons}
								size={20}
							/>
						)}
					</Pressable>

					<View
						style={[
							styles.content,
							{ justifyContent: 'space-between', flex: 1 },
						]}
					>
						<Text style={styles.label} variant="bodyMedium">
							{data.label}
						</Text>

						<Text
							style={[
								styles.label,
								{ alignSelf: 'baseline', opacity: 0.7, fontStyle: 'italic' },
							]}
							variant="labelSmall"
						>
							{Boolean(data.is_default) ? 'default' : ''}
						</Text>
					</View>
				</View>
			</Surface>
		</Pressable>
	);
}

export default memo(TransactionCategoryCard);

const styles = StyleSheet.create({
	card: {
		paddingVertical: 9,
		paddingHorizontal: 12,
		marginHorizontal: 16,
		borderWidth: 1,
	},
	content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	checkIconBox: {
		borderRadius: 100,
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	label: {
		fontFamily: 'Manrope-Regular',
	},
});

