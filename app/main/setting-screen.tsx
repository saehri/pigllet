import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Avatar } from 'react-native-paper';
import { Alert, BackHandler, ScrollView, StyleSheet, View } from 'react-native';

import MainSetting from '@/components/profile/main-settings';
import SecondarySetting from '@/components/profile/secondary-setting';

export default function ProfileScreen(props: any) {
	useEffect(() => {
		const backAction = () => {
			props.jumpTo('home');
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, []);

	return (
		<SafeAreaView>
			<ScrollView
				style={style.mainContainer}
				showsVerticalScrollIndicator={false}
			>
				<View
					style={{ paddingHorizontal: 16, paddingTop: 64, marginBottom: 24 }}
				>
					<Avatar.Text style={{ alignSelf: 'flex-end' }} size={48} label="SB" />

					<Text variant="headlineLarge">Settings</Text>
				</View>

				<MainSetting />
				<SecondarySetting />
			</ScrollView>
		</SafeAreaView>
	);
}

const style = StyleSheet.create({
	mainContainer: {
		paddingHorizontal: 8,
	},
});
