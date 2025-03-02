import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	Surface,
	Text,
	useTheme,
} from 'react-native-paper';

type Props = PropsWithChildren<{
	title: string;
	customStyle?: any;
}>

export default function WidgetWrapper({ title, customStyle, children }: Props) {
	const theme = useTheme();

	return (
		<View
			style={{ ...customStyle }}
		>
			<Text variant="titleMedium" style={[styles.title, { color: theme.colors.primary }]}
			>
				{title}
			</Text>

			<Surface elevation={2} mode='flat' style={{ padding: 10, borderRadius: 12 }}>
				{children}
			</Surface>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'Inter-Black', marginBottom: 8
	}
})