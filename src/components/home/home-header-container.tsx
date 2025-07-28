import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = {
	children: React.ReactNode;
};

export default function HomeHeaderContainer({ children }: Props) {
	const theme = useTheme();

	return (
		<View
			style={[
				styles.headerContainer,
				{ backgroundColor: theme.colors.background },
			]}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		paddingTop: 60,
		paddingHorizontal: 16,
		flex: 0.7,
		gap: 6,
	},
});

