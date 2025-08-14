import { memo, ReactNode, useState } from 'react';
import { Surface, useTheme } from 'react-native-paper';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
	leftComponent?: ReactNode;
}

function CustomTextInput({ leftComponent, ...props }: Props) {
	const theme = useTheme();
	const [isFocused, setFocused] = useState(false);

	return (
		<Surface
			mode="flat"
			elevation={5}
			style={[
				styles.container,
				{
					borderColor: isFocused
						? theme.colors.primary
						: theme.colors.outlineVariant,
				},
			]}
		>
			{leftComponent}

			<TextInput
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				{...props}
				style={[styles.textInput, { color: theme.colors.onSurface }]}
				placeholderTextColor={theme.colors.outlineVariant}
			/>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 50,
		padding: 8,
		paddingHorizontal: 16,
		gap: 12,
		borderWidth: 1,
		width: '100%',
		borderRadius: 16,
		alignItems: 'center',
		flexDirection: 'row',
	},
	leftComponentContainer: {
		height: 30,
		width: 30,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		borderWidth: 0.5,
	},
	textInput: {
		color: 'white',
		fontFamily: 'Manrope-Regular',
		fontSize: 16,
		flex: 1,
		height: '100%',
	},
});

export default memo(CustomTextInput);
