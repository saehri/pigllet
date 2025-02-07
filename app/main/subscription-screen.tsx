import { router } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

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
		<View>
			<Appbar.Header>
				<Appbar.Content
					title="Subscriptions"
					titleStyle={{ fontWeight: 'bold' }}
				/>

				<Appbar.Action icon="calendar" onPress={() => {}} />
				<Appbar.Action
					icon="cog-outline"
					onPress={() => router.push('/setting-screen')}
				/>
			</Appbar.Header>

			<Text>Hello from subscriptions screen</Text>
		</View>
	);
}
