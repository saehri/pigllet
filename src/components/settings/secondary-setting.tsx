import { List, Text, useTheme } from 'react-native-paper';
import { BadgeInfo, Mail, Smartphone } from 'lucide-react-native';
import { Linking, StyleSheet, ToastAndroid, View } from 'react-native';

import { cardBorderRadius } from '@/utils/utils';

export default function SecondarySetting() {
	const theme = useTheme();

	const openLinkToGithubRepo = async () => {
		const url = 'https://github.com/saehri/pigllet';
		const supported = await Linking.canOpenURL(url);

		if (supported) {
			await Linking.openURL(url);
		} else {
			ToastAndroid.show(
				"Don't know how to open URI: " + url,
				ToastAndroid.SHORT
			);
		}
	};

	const openLinkToEmail = async () => {
		const url = 'mailto:bahreesaepul1@gmail.com';
		const supported = await Linking.canOpenURL(url);
		if (supported) {
			await Linking.openURL(url);
		}
	};

	return (
		<View style={styles.settingContainer}>
			<Text style={styles.settingHeader}>About and Support</Text>

			<View style={styles.settingList}>
				<List.Item
					title="About"
					description="Take a peek at the people behind Pigllet"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
					onPress={openLinkToGithubRepo}
					left={(props) => (
						<BadgeInfo
							{...props}
							size={24}
							strokeWidth={1.5}
							color={props.color}
						/>
					)}
					style={[
						styles.listItem,
						{
							backgroundColor: theme.colors.elevation.level2,
							borderTopLeftRadius: cardBorderRadius['first'].tl,
							borderTopRightRadius: cardBorderRadius['first'].tr,
						},
					]}
				/>

				<List.Item
					title="Contact us"
					description="bahreesaepul1@gmail.com"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
					onPress={openLinkToEmail}
					left={(props) => (
						<Mail {...props} size={24} strokeWidth={1.5} color={props.color} />
					)}
					style={[
						styles.listItem,
						{
							backgroundColor: theme.colors.elevation.level2,
						},
					]}
				/>

				<List.Item
					title="App version"
					description="2.1.1"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
					left={(props) => (
						<Smartphone
							{...props}
							size={24}
							strokeWidth={1.5}
							color={props.color}
						/>
					)}
					style={[
						styles.listItem,
						{
							backgroundColor: theme.colors.elevation.level2,
							borderBottomLeftRadius: cardBorderRadius['last'].bl,
							borderBottomRightRadius: cardBorderRadius['last'].br,
						},
					]}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	settingContainer: {
		gap: 12,
		paddingHorizontal: 16,
	},
	settingHeader: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
	},
	settingList: {
		gap: 2,
	},
	listItem: {
		borderRadius: 6,
	},
});

