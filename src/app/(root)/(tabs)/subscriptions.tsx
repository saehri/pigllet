import { ScrollView } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';

export default function SubscriptionScreen(props: any) {
	const theme = useTheme()

	return (
		<ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: theme.colors.background }}>
			<Text>Hello from subscriptions screen</Text>
		</ScrollView>
	);
}
