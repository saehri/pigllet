import { StyleSheet, ToastAndroid, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import {
	getChartDataByCategory,
	getChartDataByDate,
	getChartDataByType,
	getStackedChartDataByDate,
	TransactionWithDetails,
} from '@/utils/group-transactions';

type Props = {
	transactions: TransactionWithDetails[];
	groupBy: 'date' | 'category' | 'type';
};

export default function TransactionsSummaryChart({
	transactions,
	groupBy,
}: Props) {
	const theme = useTheme();

	const [loading, setLoading] = useState(true);
	const [chartData, setChartData] = useState<any[]>([]);

	useEffect(() => {
		async function load() {
			try {
				const data = await getStackedChartDataByDate(transactions);
				setChartData(data);
				// if (groupBy === 'category') {
				// 	const data = await getChartDataByCategory(transactions);
				// 	setChartData(data);
				// } else if (groupBy === 'date') {
				// } else {
				// 	const data = await getChartDataByType(transactions);
				// 	setChartData(data);
				// }
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, [transactions]);

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
				barWidth={60} // Adjust bar width for proportionate spacing
				barBorderRadius={100}
				stackData={chartData}
				frontColor={theme.colors.secondary} // Main color for bars
				spacing={groupBy === 'category' ? 6 : 17}
				rulesThickness={0} // Thin grid lines for subtlety
				noOfSections={7}
				stepHeight={30}
				xAxisThickness={0}
				yAxisThickness={0}
				yAxisTextStyle={{
					fontFamily: 'Manrope-Regular',
					fontSize: 9, // Adjust axis labels for clarity
					color: theme.colors.onBackground,
				}}
				xAxisLabelTextStyle={{
					fontFamily: 'Manrope-Regular',
					textTransform: 'capitalize',
					fontSize: 10,
					color: theme.colors.onBackground,
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

