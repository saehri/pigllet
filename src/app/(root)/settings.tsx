import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar, Appbar, Surface, useTheme } from 'react-native-paper';
import { ScrollView, useColorScheme, View } from 'react-native';

import MainSetting from '@/src/components/profile/main-settings';
import SecondarySetting from '@/src/components/profile/secondary-setting';

export default function ProfileScreen() {
	const router = useRouter();
	const theme = useTheme();

	return (
		<SafeAreaView style={{ backgroundColor: theme.colors.background }}>
			<ScrollView
				stickyHeaderIndices={[0]}
				showsVerticalScrollIndicator={false}
			>
				<Appbar>
					<Appbar.BackAction onPress={() => router.back()} />
				</Appbar>

				<MainSetting />
				<SecondarySetting />
			</ScrollView>
		</SafeAreaView>
	);
}
