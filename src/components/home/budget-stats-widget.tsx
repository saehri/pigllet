import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import WidgetWrapper from '../reusables/widget-wrapper';
import { useRouter } from 'expo-router';

export default function BudgetStatsWidget() {
	const router = useRouter();

	return (
		<WidgetWrapper customStyle={{ marginHorizontal: 16, marginVertical: 5 }}>
			<View style={{ gap: 10 }}>
				<Text variant="titleMedium" style={{ fontFamily: 'Inter-Regular' }}>
					You have no budget set
				</Text>

				<Button
					onPress={() => router.push('/budget')}
					mode="contained"
					contentStyle={{ flexDirection: 'row-reverse', padding: 8 }}
					labelStyle={{ fontFamily: 'Inter-Medium', fontSize: 16 }}
					style={{ borderRadius: 10 }}
				>
					Add budget
				</Button>
			</View>
		</WidgetWrapper>
	);
}

