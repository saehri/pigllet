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
				justifyContent: 'flex-end',
				gap: 8,
				flex: 1,
				minHeight: 200,
			}}
		>
			<SearchX
				size={36}
				color={theme.colors.onSecondaryContainer}
				strokeWidth={0.5}
				fill={theme.colors.onSecondaryContainer}
				fillOpacity={0.3}
			/>

			<Text
				variant="headlineMedium"
				style={{ fontFamily: 'Manrope-SemiBold', textAlign: 'center' }}
			>
				Whoops!
			</Text>

			<Text
				variant="bodyLarge"
				style={{ fontFamily: 'Manrope-Regular', textAlign: 'center' }}
			>
				Looks like there's nothing to show at the moment.
			</Text>
		</View>
	);
}

