import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Surface, useTheme } from 'react-native-paper';
import { ScrollView, useColorScheme, View } from 'react-native';

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
