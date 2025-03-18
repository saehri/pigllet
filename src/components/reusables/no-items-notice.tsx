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
				gap: 16,
				minHeight: 300,
			}}
		>
			<SearchX size={56} color={theme.colors.primary} strokeWidth={1} />

			<Text
				variant="bodyLarge"
				style={{ fontFamily: 'Inter-Regular', textAlign: 'center' }}
			>
				No item found.
			</Text>
		</View>
	);
}
