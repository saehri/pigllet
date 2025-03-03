import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { CloudUpload, CurrencyIcon, LockKeyhole, Notebook, User, Wallet2 } from 'lucide-react-native'

export default function MainSetting() {
	const router = useRouter();

	return (
		<View>
			<List.Item
				title="Account"
				description="Avatar, email, password"
				left={(props) => <User {...props} size={24} strokeWidth={1.5} color={props.color} />}
			/>

			<List.Item
				title="Transaction category"
				description="Income, expense, transfer"
				left={(props) => (
					<Notebook {...props} size={24} strokeWidth={1.5} color={props.color} />
				)}
			/>

			<List.Item
				title="Cloud Sync"
				description="You are up to date"
				left={(props) => <CloudUpload {...props} size={24} strokeWidth={1.5} color={props.color} />}
			/>

			<List.Item
				title="Security"
				description="App lock, fingerprint"
				left={(props) => <LockKeyhole {...props} size={24} strokeWidth={1.5} color={props.color} />}
			/>

			<List.Item
				title="Wallets"
				left={(props) => <Wallet2 {...props} size={24} strokeWidth={1.5} color={props.color} />}
			/>

			<List.Item
				title="Currency"
				left={(props) => <CurrencyIcon {...props} size={24} strokeWidth={1.5} color={props.color} />}
			/>
		</View>
	);
}
