import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import {
	CloudUpload,
	CurrencyIcon,
	LockKeyhole,
	Notebook,
	SwatchBook,
	User,
	Wallet2,
} from 'lucide-react-native';

export default function MainSetting() {
	const router = useRouter();

	return (
		<View>
			<List.Item
				title="Account (Coming Soon)"
				description="Avatar, email, password"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<User {...props} size={24} strokeWidth={1.5} color={props.color} />
				)}
			/>

			<List.Item
				title="Theming"
				description="Theme, color"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<SwatchBook
						{...props}
						size={24}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			/>

			<List.Item
				title="Transaction category"
				description="Income, expense, transfer"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<Notebook
						{...props}
						size={24}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			/>

			<List.Item
				title="Cloud Sync (Coming Soon)"
				description="You are up to date"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<CloudUpload
						{...props}
						size={24}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			/>

			<List.Item
				title="Security"
				description="App lock, fingerprint"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<LockKeyhole
						{...props}
						size={24}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			/>

			<List.Item
				title="Wallets"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<Wallet2 {...props} size={24} strokeWidth={1.5} color={props.color} />
				)}
			/>

			<List.Item
				title="Currency"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<CurrencyIcon
						{...props}
						size={24}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			/>
		</View>
	);
}
