import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function NoItemNotice() {
	return (
		<View
			style={{
				paddingHorizontal: 16,
				alignItems: 'center',
				justifyContent: 'center',
				gap: 8,
				flex: 1,
				minHeight: 105,
			}}
		>
			<Text
				variant="bodyLarge"
				style={{
					fontFamily: 'Manrope-Regular',
					textAlign: 'center',
					opacity: 0.5,
				}}
			>
				No data available to display at the moment.
			</Text>
		</View>
	);
}

