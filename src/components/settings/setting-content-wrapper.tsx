import { View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

type Props = {
	headerTitle: string;
	children: React.ReactNode;
};

export default function SettingContentWrapper({
	headerTitle,
	children,
}: Props) {
	return (
		<View style={{ gap: 12 }}>
			<Text
				variant="bodyMedium"
				style={{ opacity: 0.8, marginLeft: 16, fontFamily: 'Inter-Regular' }}
			>
				{headerTitle}
			</Text>

			<Surface mode="flat" elevation={2} style={{ borderRadius: 24 }}>
				{children}
			</Surface>
		</View>
	);
}
