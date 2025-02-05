import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionScreen(props: any) {
	useEffect(() => {
		const backAction = () => {
			props.jumpTo('home');
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, []);

	return (
		<SafeAreaView>
			<Text>Hello from transaction screen</Text>
		</SafeAreaView>
	);
}
