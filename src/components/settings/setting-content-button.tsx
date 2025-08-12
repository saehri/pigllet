import { TRANSACTION_CARD_BR } from '@/utils/utils';
import { ChevronsUpDown } from 'lucide-react-native';
import { useMemo } from 'react';
import {
	Pressable,
	StyleProp,
	StyleSheet,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
	label: string;
	description?: string;
	buttonRightTitle?: string;
	buttonRight?: React.ReactNode;
	onPress?: () => void;
	higlight?: boolean;
	labelStyle?: StyleProp<TextStyle>;
	contentStyle?: StyleProp<ViewStyle>;
	position: CardPositionsTypes;
};

export default function SettingContentButton({
	buttonRightTitle,
	label,
	buttonRight,
	onPress,
	higlight,
	contentStyle = {},
	labelStyle = {},
	position,
	description,
}: Props) {
	const theme = useTheme();

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
			style={[
				styles.container,
				cardRadiusStyle,
				{
					...(contentStyle as object),
					backgroundColor: higlight
						? theme.colors.elevation.level1
						: theme.colors.elevation.level3,
				},
			]}
			onPress={onPress}
		>
			<View>
				<Text
					variant="bodyLarge"
					style={{
						fontFamily: 'Manrope-Regular',
						...(labelStyle as object),
						color: higlight ? theme.colors.primary : theme.colors.onSurface,
					}}
				>
					{label}
				</Text>

				{description && (
					<Text
						style={{
							fontFamily: 'Manrope-Light',
							opacity: 0.7,
						}}
					>
						{description}
					</Text>
				)}
			</View>

			{buttonRight ? (
				buttonRight
			) : (
				<View style={styles.buttonRight}>
					<Text variant="bodyLarge" style={{ fontFamily: 'Manrope-Light' }}>
						{buttonRightTitle}
					</Text>
					<ChevronsUpDown
						strokeWidth={1.5}
						size={18}
						color={theme.colors.onBackground}
					/>
				</View>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 16,
		padding: 16,
		alignItems: 'center',
	},
	buttonRight: {
		flexDirection: 'row',
		gap: 2,
		opacity: 0.6,
		alignItems: 'center',
	},
});

