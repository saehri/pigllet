import { useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';

import MainSetting from '@/src/components/settings/main-settings';
import SecondarySetting from '@/src/components/settings/secondary-setting';

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

