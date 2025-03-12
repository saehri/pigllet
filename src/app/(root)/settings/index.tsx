import { useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';

import MainSetting from '@/src/components/profile/main-settings';
import SecondarySetting from '@/src/components/profile/secondary-setting';

export default function ProfileScreen() {
	const theme = useTheme();

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{ backgroundColor: theme.colors.background }}
		>
			<MainSetting />
			<SecondarySetting />
		</ScrollView>
	);
}
