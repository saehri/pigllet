import { memo } from 'react';
import { useRouter } from 'expo-router';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { TransactionType } from '@/db/schema';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { fastSpatialEasing } from '@/utils/utils';

type Props = {
	categType: TransactionType;
	direction: 'up' | 'down' | null;
};

function CategoryFab({ categType, direction }: Props) {
	const router = useRouter();

	return (
		<>
			{direction === 'up' && (
				<Animated.View
					entering={FadeInDown.duration(500).easing(fastSpatialEasing)}
					exiting={FadeOutDown.duration(500).easing(fastSpatialEasing)}
				>
					<FAB
						icon="plus"
						style={styles.fab}
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

