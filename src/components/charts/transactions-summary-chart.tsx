import { Text, useTheme } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import { groupTransactionsByCategory } from '@/utils/group-transactions';

import { Transaction } from '@/db/schema';
import { View } from 'react-native';

type Props = {
	transactions: Transaction[];
};

export default function TransactionsSummaryChart({ transactions }: Props) {
	const theme = useTheme();

	const [chartData, setChartData] = useState<barDataItem[]>([]);

	useEffect(() => {
		const data = groupTransactionsByCategory(transactions);
		setChartData(data);
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
			data={chartData}
			frontColor={theme.colors.primary} // Main color for bars
			rulesThickness={1} // Thin grid lines for subtlety
			rulesColor={'rgba(255, 255, 255, .2)'} // Grid color matching the theme
			barWidth={28} // Adjust bar width for proportionate spacing
			height={180}
			indicatorColor={'default'} // White indicator line
			capColor={'#FF0000'} // Red cap color (Top end of bars)
			color={'#00FF00'} // Base color for bars (Green in this case)
			lineBehindBars={false} // Keeps bars visually distinct
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
			yAxisThickness={0}
			xAxisThickness={0}
			spacing={16} // Provides spacing between bars
			isAnimated // Adds smooth animation for better UX
			barBorderTopLeftRadius={8}
			barBorderTopRightRadius={8}
			noOfSections={7}
			stepHeight={26}
		/>
	);
}
