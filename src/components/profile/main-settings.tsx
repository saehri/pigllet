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
				title="User"
				description="Email, password, delete data"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				onPress={() => router.push('/(root)/settings/user')}
				left={(props) => (
					<User {...props} size={24} strokeWidth={1.5} color={props.color} />
				)}
			/>

			<List.Item
				title="Customizations"
				description="Theme, color, language, motion"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				onPress={() => router.push('/(root)/settings/customization')}
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
				onPress={() => router.push('/(root)/settings/transaction-categories')}
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
				title="Cloud sync (coming soon)"
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
				onPress={() => router.push('/(root)/settings/security')}
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
				title="Accounts"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				onPress={() => router.push('/(root)/settings/accounts')}
				left={(props) => (
					<Wallet2 {...props} size={24} strokeWidth={1.5} color={props.color} />
				)}
			/>

			<List.Item
				title="Currency symbols"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				onPress={() => router.push('/(root)/settings/currency')}
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
