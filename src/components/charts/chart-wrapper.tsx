import { Surface, useTheme } from 'react-native-paper';

type Props = {
	children: React.ReactNode;
};

export default function ChartWrapper({ children }: Props) {
	const theme = useTheme();

	return (
		<Surface
			mode="flat"
			elevation={4}
			style={{
				borderRadius: 20,
				overflow: 'hidden',
				padding: 16,
				paddingTop: 10,
				alignItems: 'center',
				borderWidth: 1,
				borderColor: theme.colors.outlineVariant,
			}}
		>
			{children}
		</Surface>
	);
}
