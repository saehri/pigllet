import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import {
	LockKeyhole,
	Notebook,
	SwatchBook,
	User,
	Wallet2,
} from 'lucide-react-native';

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

export default function MainSetting() {
	const router = useRouter();
	const theme = useTheme();

	return (
		<View style={styles.settingContainer}>
			<Text style={styles.settingHeader}>General</Text>

			<View style={styles.settingList}>
				<List.Item
					title="User"
					description="Email, password, delete data"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
					onPress={() => router.push('/(root)/settings/user')}
					left={(props) => (
						<User {...props} size={24} strokeWidth={1.5} color={props.color} />
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
					title="Customizations"
					description="Theme, default currency"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
					onPress={() => router.push('/(root)/settings/customization')}
					left={(props) => (
						<SwatchBook
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
						},
					]}
				/>
				<List.Item
					title="Transaction category"
					description="Manage the category of your transactions"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
					onPress={() =>
						router.push('/(root)/settings/transaction-categories/expense')
					}
					left={(props) => (
						<Notebook
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
						},
					]}
				/>
				<List.Item
					title="Security"
					description="App lock, fingerprint"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
					onPress={() => router.push('/(root)/settings/security')}
					left={(props) => (
						<LockKeyhole
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
						},
					]}
				/>
				<List.Item
					title="Accounts"
					description="Transactions by accounts, add account"
					titleStyle={{ fontFamily: 'Manrope-Regular' }}
					descriptionStyle={{ fontFamily: 'Manrope-Light', opacity: 0.7 }}
					onPress={() => router.push('/(root)/settings/accounts')}
					left={(props) => (
						<Wallet2
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

