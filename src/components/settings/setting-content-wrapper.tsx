import { View } from 'react-native';
import { Text } from 'react-native-paper';

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
			<Text style={{ opacity: 0.8, fontFamily: 'Manrope-Regular' }}>
				{headerTitle}
			</Text>

			<View style={{ gap: 2 }}>{children}</View>
		</View>
	);
}

