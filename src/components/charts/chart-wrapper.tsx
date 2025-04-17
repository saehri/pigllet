import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

type Props = {
	children: React.ReactNode;
};

export default function ChartWrapper({ children }: Props) {
	const theme = useTheme();

	return (
		<View
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: theme.colors.outlineVariant,
				overflow: 'hidden',
			}}
		>
			<LinearGradient
				style={{
					padding: 16,

					alignItems: 'center',

					paddingTop: 10,
				}}
				colors={[theme.colors.elevation.level5, theme.colors.elevation.level4]}
			>
				{children}
			</LinearGradient>
		</View>
	);
}
