import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import WidgetWrapper from '../reusables/widget-wrapper';

export default function BudgetStatsWidget() {
	return (
		<WidgetWrapper
			icon="chart-arc"
			title="Your budget stats"
			customStyle={{ marginHorizontal: 16, marginVertical: 5 }}
		>
			<View style={{ gap: 10 }}>
				<Text variant="titleMedium">You have no budget set</Text>

				<Button
					mode="contained"
					icon="plus"
					contentStyle={{ flexDirection: 'row-reverse' }}
				>
					Set one now
				</Button>
			</View>
		</WidgetWrapper>
	);
}
