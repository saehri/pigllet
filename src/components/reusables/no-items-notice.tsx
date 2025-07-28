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
			<View
				style={{
					width: 80,
					height: 80,
					borderRadius: 100,
					backgroundColor: theme.colors.secondaryContainer,
					alignItems: 'center',
					justifyContent: 'center',
					marginBottom: 12,
				}}
			>
				<SearchX
					size={50}
					color={theme.colors.onSecondaryContainer}
					strokeWidth={0.5}
					fill={theme.colors.onSecondaryContainer}
					fillOpacity={0.3}
				/>
			</View>

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

