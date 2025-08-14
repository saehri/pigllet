import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
	children: React.ReactNode;
};

const HomeHeaderComponent = memo(function HomeHeaderContainer({
	children,
}: Props) {
	return <View style={styles.headerContainer}>{children}</View>;
});

export default HomeHeaderComponent;

const styles = StyleSheet.create({
	headerContainer: {
		paddingTop: 60,
		gap: 8,
		flex: 1,
		paddingHorizontal: 16,
	},
});

