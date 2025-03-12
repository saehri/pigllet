import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
	handleSelect: () => void;
	value: string;
	label: string;
	selected: string;
};

export default function SelectInputItem({
	handleSelect,
	label,
	value,
	selected,
}: Props) {
	const theme = useTheme();

	return (
		<Pressable style={styles.container} onPress={handleSelect}>
			<View
				style={[
					styles.indicator,
					{
						borderColor: theme.colors.outline,
					},
				]}
			>
				<View
					style={[
						styles.indicatorDot,
						{
							display: selected === value ? 'flex' : 'none',
							backgroundColor: theme.colors.primary,
						},
					]}
				></View>
			</View>

			<Text variant="bodyLarge" style={{ textTransform: 'capitalize' }}>
				{label}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 16,
		alignItems: 'center',
	},
	indicator: {
		width: 20,
		height: 20,
		borderRadius: 100,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	indicatorDot: {
		width: 11,
		height: 11,
		borderRadius: 1000,
	},
});
