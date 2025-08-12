import { TRANSACTION_CARD_BR } from '@/utils/utils';
import { Dispatch, SetStateAction } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

type ToggleButtonProps = {
	label: string;
	currentValue: boolean;
	setCurrentValue: Dispatch<SetStateAction<boolean>>;
	position: CardPositionsTypes;
};

export default function BottomSheetToggleButton({
	currentValue,
	label,
	setCurrentValue,
	position,
}: ToggleButtonProps) {
	const theme = useTheme();

	return (
		<Surface
			mode="flat"
			elevation={4}
			style={[
				styles.checkboxContainer,
				{
					borderTopRightRadius: TRANSACTION_CARD_BR[position].tr,
					borderTopLeftRadius: TRANSACTION_CARD_BR[position].tl,
					borderBottomLeftRadius: TRANSACTION_CARD_BR[position].bl,
					borderBottomRightRadius: TRANSACTION_CARD_BR[position].br,
				},
			]}
		>
			<Text variant="bodyLarge" style={styles.checkboxTitle}>
				{label}
			</Text>

			<Pressable
				onPress={() => setCurrentValue((prev) => !prev)}
				style={[
					styles.checkboxButton,
					{
						borderColor: theme.colors.outlineVariant,
						backgroundColor: theme.colors.elevation.level2,
						justifyContent: currentValue ? 'flex-end' : 'flex-start',
					},
				]}
			>
				<View
					style={[
						styles.checkboxButtonIndicator,
						{ backgroundColor: theme.colors.tertiary },
					]}
				></View>
			</Pressable>
		</Surface>
	);
}

const styles = StyleSheet.create({
	checkboxContainer: {
		padding: 16,
		borderRadius: 6,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		flex: 1,
	},
	checkboxTitle: {
		fontFamily: 'Manrope-Regular',
	},
	checkboxButton: {
		height: 24,
		width: 60,
		borderWidth: 1,
		borderRadius: 100,
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 3,
	},
	checkboxButtonIndicator: {
		width: 35,
		height: 15,
		borderRadius: 100,
	},
	checkboxSectionTitle: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
		marginBottom: 12,
	},
});

