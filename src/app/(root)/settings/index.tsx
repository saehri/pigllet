import { useTheme } from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native';

import MainSetting from '@/src/components/settings/main-settings';
import SecondarySetting from '@/src/components/settings/secondary-setting';

export default function ProfileScreen() {
	const theme = useTheme();

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{ backgroundColor: theme.colors.background }}
		>
			<View style={styles.container}>
				<MainSetting />
				<SecondarySetting />
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
});
