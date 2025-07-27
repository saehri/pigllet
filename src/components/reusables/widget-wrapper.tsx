import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

type Props = PropsWithChildren<{
	title?: string;
	customStyle?: any;
}>;

export default function WidgetWrapper({ title, customStyle, children }: Props) {
	const theme = useTheme();

	return (
		<View style={{ ...customStyle }}>
			{title?.length && (
				<Text
					variant="titleMedium"
					style={[styles.title, { color: theme.colors.primary }]}
				>
					{title}
				</Text>
			)}

			<Surface
				style={[
					styles.surface,
					{
						borderColor: theme.colors.outlineVariant,
					},
				]}
				elevation={3}
			>
				{children}
			</Surface>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'Manrope-Regular',
		marginBottom: 8,
	},
	surface: {
		borderRadius: 16,
		overflow: 'hidden',
		borderWidth: 1,
		padding: 16,
	},
});

