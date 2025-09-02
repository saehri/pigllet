import { useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dispatch, memo, SetStateAction, useState } from 'react';

type Props = {
	selectedValue: any;
	setSelectedValue: Dispatch<SetStateAction<any>>;
	data: { value: any; label: any }[];
};

function SelectInput({ selectedValue, setSelectedValue, data }: Props) {
	const theme = useTheme();

	const [open, setOpened] = useState(false);

	const handleValueChange = (itemValue: number) => {
		setSelectedValue(itemValue);
	};

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.elevation.level5,
					borderColor: open
						? theme.colors.primary
						: theme.colors.outlineVariant,
				},
			]}
		>
			<Picker
				mode="dropdown"
				selectedValue={selectedValue}
				onValueChange={handleValueChange}
				style={{
					color: theme.colors.onSurface,
					backgroundColor: theme.colors.elevation.level5,
					borderRadius: 12,
					fontFamily: 'Manrope-Medium',
				}}
				dropdownIconColor={theme.colors.onSurface}
				onFocus={() => setOpened(true)}
				onBlur={() => setOpened(false)}
			>
				{data.map((d) => (
					<Picker.Item
						key={d.label}
						label={d.label}
						value={d.value}
						fontFamily="Manrope-Regular"
						color={
							selectedValue === d.value
								? theme.colors.primary
								: theme.colors.onSurface
						}
						style={{
							backgroundColor: theme.colors.elevation.level5,
						}}
					/>
				))}
			</Picker>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 6,
		borderRadius: 16,
		overflow: 'hidden',
		flex: 1,
		height: 50,
		borderWidth: 1,
	},
});

export default memo(SelectInput);

