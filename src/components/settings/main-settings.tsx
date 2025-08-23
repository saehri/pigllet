import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { Notebook, SwatchBook, User, Wallet2 } from 'lucide-react-native';

import { cardBorderRadius } from '@/utils/utils';

export default function MainSetting() {
	const router = useRouter();
	const theme = useTheme();

	return (
		<View style={styles.settingContainer}>
			<Text style={styles.settingHeader}>General</Text>

			<View style={styles.settingList}>
				<List.Item
					title="User"
					description="Delete data"
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
							borderTopLeftRadius: cardBorderRadius['first'].tl,
							borderTopRightRadius: cardBorderRadius['first'].tr,
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
					title="Accounts"
					description="Add and edit account"
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

