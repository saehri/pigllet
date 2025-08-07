import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function TransactionByCategoryScreen() {
	const navigation = useNavigation();

	const { categoryId, categoryName } = useLocalSearchParams();

	useEffect(() => {
		navigation.setOptions({
			title: categoryName,
		});
	}, []);

	return <View></View>;
}

const styles = StyleSheet.create({
	chartWrapperContainer: {
		padding: 16,
		paddingBottom: 24,
	},
	renderItem: { paddingBottom: 18, gap: 8 },
	renderItemHeader: {
		fontFamily: 'Manrope-Regular',
		paddingHorizontal: 16,
		fontSize: 18,
	},
});

