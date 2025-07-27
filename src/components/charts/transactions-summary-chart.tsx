import { StyleSheet, ToastAndroid, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
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

	const [loading, setLoading] = useState(true);
	const [chartData, setChartData] = useState<barDataItem[]>([]);

	useEffect(() => {
		async function load() {
			try {
				if (groupBy === 'category') {
					const data = await getChartDataByCategory(transactions);
					setChartData(data);
				} else {
					const data = await getChartDataByDate(transactions);
					setChartData(data);
				}
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, []);

	if (loading) {
		return (
			<View style={styles.emptyAndLoadingContainer}>
				<ActivityIndicator />
			</View>
		);
	}

	if (!chartData.length) {
		return (
			<View style={styles.emptyAndLoadingContainer}>
				<Text variant="bodyLarge" style={{ fontFamily: 'Manrope-Regular' }}>
					No data.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.chartContainer}>
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
					fontFamily: 'Manrope-Regular',
					fontSize: 9, // Adjust axis labels for clarity
					color: theme.colors.onSurfaceVariant,
				}}
				xAxisLabelTextStyle={{
					fontFamily: 'Manrope-Regular',
					fontSize: 10,
					color: theme.colors.onSurfaceVariant,
				}}
				isAnimated // Adds smooth animation for better UX
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	emptyAndLoadingContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		height: 180,
	},
	chartContainer: {
		paddingHorizontal: 16,
		width: '100%',
	},
});

