import { Pressable, StyleSheet, View } from 'react-native';
import {
	memo,
	useRef,
	useState,
	Dispatch,
	useCallback,
	SetStateAction,
	useEffect,
} from 'react';
import { ChevronDownIcon, icons } from 'lucide-react-native';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Portal, Text, useTheme } from 'react-native-paper';

import { getCardPosition, cardBorderRadius } from '@/utils/utils';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

import LucideIcons from '../reusables/lucide-icons';

type Props = {
	transactionCategory: schema.TransactionType;
	selectedCategory: schema.Category;
	handleSelect: Dispatch<SetStateAction<schema.Category>>;
};

function TransactionCategorySelector({
	handleSelect,
	selectedCategory,
	transactionCategory,
}: Props) {
	const theme = useTheme();
	const drizzleDb = useDrizzleDB();

	const [categories, setCategories] = useState<schema.Category[]>();

	useEffect(() => {
		const loadTransactionCategory = async () => {
			const data = await drizzleDb
				.select()
				.from(schema.categories)
				.where(eq(schema.categories.type, transactionCategory));

			setCategories(data);
		};

		loadTransactionCategory();
	}, []);

	const [isFocused, setFocused] = useState(false);

	const snapPoints = ['55%', '93%'];
	const bottomSheetRef = useRef<BottomSheet>(null);

	// renders
	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

	const openBottomSheet = () => {
		bottomSheetRef.current?.snapToIndex(0);
		setFocused(true);
	};

	return (
		<>
			<Pressable
				style={[
					styles.selectBox,
					{
						backgroundColor: theme.colors.elevation.level5,
						borderColor: isFocused
							? theme.colors.primary
							: theme.colors.outlineVariant,
					},
				]}
				onPress={openBottomSheet}
			>
				<Text
					style={[styles.selectText, { color: theme.colors.onSurface }]}
					numberOfLines={1}
					variant="bodyLarge"
				>
					{selectedCategory?.label ?? 'Select a category'}
				</Text>

				<ChevronDownIcon
					color={theme.colors.onSurface}
					size={20}
					strokeWidth={1.5}
				/>
			</Pressable>

			<Portal>
				<BottomSheet
					onClose={() => setFocused(false)}
					ref={bottomSheetRef}
					snapPoints={snapPoints}
					enablePanDownToClose={true}
					overDragResistanceFactor={0.5}
					index={-1}
					backdropComponent={renderBackdrop}
					enableDynamicSizing={false}
					backgroundStyle={{
						backgroundColor: theme.colors.elevation.level2,
					}}
					handleIndicatorStyle={{
						backgroundColor: theme.colors.secondary,
						height: 6,
						width: 35,
					}}
				>
					<BottomSheetScrollView
						contentContainerStyle={{ paddingHorizontal: 16, gap: 2 }}
					>
						{categories?.map((c, index) => (
							<SelectButton
								position={getCardPosition(index, categories.length)}
								icon_name={c.icon_name}
								label={c.label}
								type={c.type}
								id={c.id}
								is_default={c.is_default}
								key={c.id}
								selected={selectedCategory?.id == c.id}
								onPress={() => handleSelect(c)}
							/>
						))}
					</BottomSheetScrollView>
				</BottomSheet>
			</Portal>
		</>
	);
}

interface SelectButton extends schema.Category {
	position: CardPositionsTypes;
	selected: boolean;
	onPress: () => void;
}

function SelectButton({
	icon_name,
	label,
	position,
	selected,
	onPress,
}: SelectButton) {
	const theme = useTheme();

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.selectButtonContainer,
				{
					borderTopLeftRadius: cardBorderRadius[position].tl,
					borderTopRightRadius: cardBorderRadius[position].tr,
					borderBottomRightRadius: cardBorderRadius[position].br,
					borderBottomLeftRadius: cardBorderRadius[position].bl,
					backgroundColor: selected
						? theme.colors.tertiaryContainer
						: theme.colors.elevation.level5,
					borderColor: selected
						? theme.colors.tertiary
						: theme.colors.elevation.level5,
				},
			]}
		>
			<View style={styles.selectButtonIcon}>
				<LucideIcons
					name={icon_name as keyof typeof icons}
					size={20}
					color={theme.colors.onSurface}
				/>
			</View>

			<Text
				style={[styles.selectText, { color: theme.colors.onSurface }]}
				variant="bodyLarge"
			>
				{label}
			</Text>
		</Pressable>
	);
}

export default memo(TransactionCategorySelector);

const styles = StyleSheet.create({
	selectBox: {
		height: 50,
		padding: 8,
		borderWidth: 1,
		width: '100%',
		borderRadius: 16,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		overflow: 'hidden',
	},
	selectBoxContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	selectText: {
		color: '#fff',
		fontFamily: 'Manrope-Regular',
	},
	icon: {
		position: 'absolute',
		right: 8,
	},
	selectButtonContainer: {
		paddingHorizontal: 12,
		paddingVertical: 9,
		alignItems: 'center',
		flexDirection: 'row',
		gap: 12,
		borderWidth: 1,
	},
	selectButtonIcon: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
	},
});

