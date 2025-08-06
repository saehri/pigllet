import { List, Text, useTheme } from 'react-native-paper';
import { BadgeInfo, Mail, Smartphone } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

const borderRadius = {
	tr: {
		first: 16,
		middle: 6,
		only: 16,
		last: 6,
	},
	tl: {
		first: 16,
		middle: 6,
		only: 16,
		last: 6,
	},
	br: {
		first: 6,
		middle: 6,
		only: 16,
		last: 16,
	},
	bl: {
		first: 6,
		middle: 6,
		only: 16,
		last: 16,
	},
};

export default function SecondarySetting() {
	const theme = useTheme();

	return (
		<View style={styles.settingContainer}>
			<Text style={styles.settingHeader}>About and Support</Text>

			<View style={styles.settingList}>
				<List.Item
					title="About"
					description="Take a peek at the people behind Pigllet"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
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
							borderTopLeftRadius: borderRadius.tl.first,
							borderTopRightRadius: borderRadius.tr.first,
						},
					]}
				/>

				<List.Item
					title="Contact us"
					description="If you need help or have some advice"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
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
					description="2.0.0"
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
							borderBottomLeftRadius: borderRadius.bl.last,
							borderBottomRightRadius: borderRadius.br.last,
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

