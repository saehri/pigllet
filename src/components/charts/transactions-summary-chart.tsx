import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import {
	getChartDataByCategory,
	getChartDataByDate,
} from '@/utils/group-transactions';

import { Transaction } from '@/db/schema';

type Props = {
	transactions: Transaction[];
	groupBy: 'date' | 'category';
};

export default function TransactionsSummaryChart({
	transactions,
	groupBy,
}: Props) {
	const theme = useTheme();

	const [chartData, setChartData] = useState<barDataItem[]>([]);

	useEffect(() => {
		if (groupBy === 'category') {
			const data = getChartDataByCategory(transactions);
			setChartData(data);
		} else {
			const data = getChartDataByDate(transactions);
			setChartData(data);
		}
	}, []);

	if (!chartData.length)
		return (
			<View
				style={{
					flex: 1,
					width: '100%',
					alignItems: 'center',
					justifyContent: 'center',
					height: 212, // 26 * 7 + 15 + 15 (stepHeight * number of step + top padding + bottom padding )
				}}
			>
				<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
					No data.
				</Text>
			</View>
		);

	return (
		<BarChart
			barWidth={30} // Adjust bar width for proportionate spacing
			barBorderTopLeftRadius={8}
			barBorderTopRightRadius={8}
			data={chartData}
			frontColor={theme.colors.primary} // Main color for bars
			indicatorColor={'default'} // White indicator line
			noOfSections={5}
			rulesThickness={1} // Thin grid lines for subtlety
			spacing={groupBy === 'category' ? 6 : 40}
			stepHeight={30}
			rulesColor={'rgba(255, 255, 255, .2)'} // Grid color matching the theme
			xAxisThickness={0}
			yAxisThickness={0}
			yAxisTextStyle={{
				fontFamily: 'Inter-Regular',
				fontSize: 9, // Adjust axis labels for clarity
				color: theme.colors.onSurfaceVariant,
			}}
			xAxisLabelTextStyle={{
				fontFamily: 'Inter-Regular',
				fontSize: 10,
				color: theme.colors.onSurfaceVariant,
			}}
			isAnimated // Adds smooth animation for better UX
		/>
	);
}

