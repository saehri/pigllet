import { Surface, useTheme } from 'react-native-paper';

type Props = {
	children: React.ReactNode;
};

export default function ChartWrapper({ children }: Props) {
	const theme = useTheme();

	return (
		<Surface
			style={{
				borderRadius: 20,
				borderWidth: 1,
				borderColor: theme.colors.outlineVariant,
				overflow: 'hidden',
				padding: 16,
				alignItems: 'center',
			}}
			elevation={3}
		>
			{children}
		</Surface>
	);
}

