import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

type Props = PropsWithChildren<{
	title: string;
	customStyle?: any;
}>;

export default function WidgetWrapper({ title, customStyle, children }: Props) {
	const theme = useTheme();

	return (
		<View style={{ ...customStyle }}>
			<Text
				variant="titleMedium"
				style={[styles.title, { color: theme.colors.primary }]}
			>
				{title}
			</Text>

			<View
				style={{
					borderRadius: 20,
					overflow: 'hidden',
					borderWidth: 1,
					borderColor: theme.colors.outlineVariant,
				}}
			>
				<LinearGradient
					colors={[
						theme.colors.elevation.level5,
						theme.colors.elevation.level4,
					]}
					style={{
						padding: 16,
					}}
				>
					{children}
				</LinearGradient>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'Inter-Regular',
		marginBottom: 8,
	},
});
