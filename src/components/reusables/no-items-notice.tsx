import { SearchX } from 'lucide-react-native';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function NoItemNotice() {
	const theme = useTheme();

	return (
		<View
			style={{
				paddingHorizontal: 16,
				alignItems: 'center',
				justifyContent: 'center',
				gap: 8,
				flex: 1,
				minHeight: 200,
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

