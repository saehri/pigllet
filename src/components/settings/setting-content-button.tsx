import { ChevronsUpDown } from 'lucide-react-native';
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
	buttonRightTitle?: string;
	buttonRight?: React.ReactNode;
	onPress?: () => void;
	higlight?: boolean;
	labelStyle?: StyleProp<TextStyle>;
	contentStyle?: StyleProp<ViewStyle>;
};

export default function SettingContentButton({
	buttonRightTitle,
	label,
	buttonRight,
	onPress,
	higlight,
	contentStyle = {},
	labelStyle = {},
}: Props) {
	const theme = useTheme();

	return (
		<Pressable
			style={[
				styles.container,
				{
					...(contentStyle as object),
					backgroundColor: higlight
						? theme.colors.elevation.level1
						: theme.colors.elevation.level3,
				},
			]}
			onPress={onPress}
		>
			<Text
				variant="bodyLarge"
				style={{ fontFamily: 'Inter-Regular', ...(labelStyle as object) }}
			>
				{label}
			</Text>

			{buttonRight ? (
				buttonRight
			) : (
				<View style={styles.buttonRight}>
					<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Light' }}>
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
