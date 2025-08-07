import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = {
	children: React.ReactNode;
};

const HomeHeaderComponent = memo(function HomeHeaderContainer({
	children,
}: Props) {
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
});

export default HomeHeaderComponent;

const styles = StyleSheet.create({
	headerContainer: {
		paddingTop: 60,
		gap: 8,
		flex: 1,
	},
});

