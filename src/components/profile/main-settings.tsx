import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { List } from 'react-native-paper';

export default function MainSetting() {
	const router = useRouter();

	return (
		<View>
			<List.Item
				title="Account"
				description="Avatar, email, password"
				left={(props) => <List.Icon {...props} icon="account-outline" />}
			/>

			<List.Item
				title="Category"
				description="Income, expense, transfer"
				left={(props) => (
					<List.Icon {...props} icon="format-list-bulleted-type" />
				)}
			/>

			<List.Item
				title="Cloud Sync"
				description="You are up to date"
				left={(props) => <List.Icon {...props} icon="sync" />}
			/>

			<List.Item
				title="Security"
				description="App lock, fingerprint"
				left={(props) => <List.Icon {...props} icon="lock-outline" />}
			/>

			<List.Item
				title="Wallets"
				left={(props) => <List.Icon {...props} icon="wallet-outline" />}
			/>

			<List.Item
				title="Currency"
				left={(props) => <List.Icon {...props} icon="currency-usd" />}
			/>
		</View>
	);
}
