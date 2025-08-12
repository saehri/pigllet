import { memo } from 'react';
import { useRouter } from 'expo-router';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { View } from 'lucide-react-native';
import { TransactionType } from '@/db/schema';
import { useSelectedCategory } from '@/store/useSelectedCategory';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

type Props = {
	categType: TransactionType;
};

function CategoryFab({ categType }: Props) {
	const router = useRouter();
	const selectedCategories = useSelectedCategory((s) => s.selectedCategories);

	return (
		<>
			{!selectedCategories.length ? (
				<Animated.View
					entering={FadeInDown.duration(350).mass(100)}
					exiting={FadeOutDown.duration(350).mass(100)}
				>
					<FAB
						icon="plus"
						style={[
							styles.fab,
							{ display: selectedCategories.length ? 'none' : 'flex' },
						]}
						onPress={() =>
							router.push({
								pathname: '/(root)/category-form',
								params: { formAction: 'create', categType },
							})
						}
						mode="flat"
						variant="secondary"
						size="medium"
					/>
				</Animated.View>
			) : (
				<View style={styles.fab}></View>
			)}
		</>
	);
}

export default memo(CategoryFab);

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 40,
	},
});

