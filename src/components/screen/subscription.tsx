import { router } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

export default function SubscriptionScreen(props: any) {
	return (
		<View>
			<Appbar.Header>
				<Appbar.Content
					title="Subscriptions"
					titleStyle={{ fontWeight: 'bold' }}
				/>

				<Appbar.Action icon="calendar" onPress={() => {}} />
			</Appbar.Header>

			<Text>Hello from subscriptions screen</Text>
		</View>
	);
}
