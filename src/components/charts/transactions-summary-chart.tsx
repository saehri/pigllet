import { useEffect, useState } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import {
	getChartDataByCategory,
	getChartDataByType,
	getStackedChartDataByDate,
	TransactionWithDetails,
} from '@/utils/group-transactions';

type Props = {
	transactions: TransactionWithDetails[];
	groupBy?: 'date' | 'category' | 'type';
};

// Simple color mapping per category type
const colorMap: Record<string, string> = {
	income: 'rgba(21, 179, 15, 1)',
	expense: 'rgba(248, 110, 30, 1)',
	transfer: 'rgba(0, 150, 150, 1)',
};

export default function TransactionsSummaryChart({
	transactions,
	groupBy = 'date',
}: Props) {
	const theme = useTheme();

	const [loading, setLoading] = useState(true);
	const [chartData, setChartData] = useState<any[]>([]);

	useEffect(() => {
		async function load() {
			try {
				if (groupBy === 'category') {
					const data = await getChartDataByCategory(transactions);
					setChartData(data);
				} else if (groupBy === 'type') {
					const data = await getChartDataByType(transactions);
					setChartData(data);
				} else {
					const data = await getStackedChartDataByDate(transactions);
					setChartData(data);
				}
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
				stepHeight={27}
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

			<View style={styles.legend}>
				<View style={styles.legendItem}>
					<View
						style={[styles.dot, { backgroundColor: colorMap.expense }]}
					></View>
					<Text style={styles.legendLabel} variant="labelSmall">
						Expense
					</Text>
				</View>

				<View style={styles.legendItem}>
					<View
						style={[styles.dot, { backgroundColor: colorMap.income }]}
					></View>
					<Text style={styles.legendLabel} variant="labelSmall">
						Income
					</Text>
				</View>

				<View style={styles.legendItem}>
					<View
						style={[styles.dot, { backgroundColor: colorMap.transfer }]}
					></View>
					<Text style={styles.legendLabel} variant="labelSmall">
						Transfer
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	emptyAndLoadingContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		height: 254,
	},
	chartContainer: {
		paddingLeft: 16,
		width: '100%',
	},
	legend: {
		gap: 12,
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 16,
		paddingRight: 16,
	},
	legendItem: {
		flexDirection: 'row',
		gap: 6,
	},
	legendLabel: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.89,
	},
	dot: {
		width: 15,
		height: 15,
		borderRadius: 200,
	},
});

