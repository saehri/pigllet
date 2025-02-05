import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionScreen(props: any) {
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
			<Text>Hello from subscription screen</Text>
		</SafeAreaView>
	);
}
