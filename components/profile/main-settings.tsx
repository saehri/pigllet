import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';

export default function MainSetting() {
	const router = useRouter();

	return (
		<View>
			<List.Item
				title="Account"
				description="Avatar, email, password"
				left={(props) => <List.Icon {...props} icon="account-outline" />}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
				onPress={() => router.push('/settings/account-setting-screen')}
			/>

			<List.Item
				title="Category"
				description="Income, expense, transfer"
				left={(props) => (
					<List.Icon {...props} icon="format-list-bulleted-type" />
				)}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>

			<List.Item
				title="Cloud Sync"
				description="You are up to date"
				left={(props) => <List.Icon {...props} icon="sync" />}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>

			<List.Item
				title="Security"
				description="App lock, fingerprint"
				left={(props) => <List.Icon {...props} icon="lock-outline" />}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>

			<List.Item
				title="Wallets"
				left={(props) => <List.Icon {...props} icon="wallet-outline" />}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>

			<List.Item
				title="Currency"
				left={(props) => <List.Icon {...props} icon="currency-usd" />}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>
		</View>
	);
}

const style = StyleSheet.create({
	listTitle: {
		fontSize: 20,
	},
	listItemStyle: {
		paddingVertical: 10,
	},
});
