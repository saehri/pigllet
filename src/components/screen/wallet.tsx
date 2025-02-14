import { router } from 'expo-router';
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

export default function TransactionScreen() {
	return (
		<View>
			<Appbar.Header>
				<Appbar.Content title="Wallet" titleStyle={{ fontWeight: 'bold' }} />
			</Appbar.Header>

			<Text>Hello from home wallet</Text>
		</View>
	);
}
