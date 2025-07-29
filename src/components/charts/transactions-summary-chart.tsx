import { useEffect, useState } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import {
	getStackedChartDataByDate,
	TransactionWithDetails,
} from '@/utils/group-transactions';
import { transactionColorMap } from '@/utils/utils';

type Props = {
	transactions: TransactionWithDetails[];
	dateFormat: string;
};

export default function TransactionsSummaryChart({
	transactions,
	dateFormat,
}: Props) {
	const theme = useTheme();

	const [loading, setLoading] = useState(true);
	const [chartData, setChartData] = useState<any[]>([]);

	useEffect(() => {
		async function load() {
			try {
				const data = await getStackedChartDataByDate(transactions, dateFormat);
				setChartData(data);
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
					No data available to display at the moment.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.chartContainer}>
			<BarChart
				barWidth={65} // Adjust bar width for proportionate spacing
				barBorderRadius={100}
				stackData={chartData}
				frontColor={theme.colors.secondary} // Main color for bars
				spacing={13}
				rulesThickness={0} // Thin grid lines for subtlety
				noOfSections={7}
				stepHeight={23}
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
						style={[
							styles.dot,
							{ backgroundColor: transactionColorMap.expense },
						]}
					></View>
					<Text style={styles.legendLabel} variant="labelSmall">
						Expense
					</Text>
				</View>

				<View style={styles.legendItem}>
					<View
						style={[
							styles.dot,
							{ backgroundColor: transactionColorMap.income },
						]}
					></View>
					<Text style={styles.legendLabel} variant="labelSmall">
						Income
					</Text>
				</View>

				<View style={styles.legendItem}>
					<View
						style={[
							styles.dot,
							{ backgroundColor: transactionColorMap.transfer },
						]}
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
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		height: 230,
	},
	chartContainer: {
		paddingLeft: 16,
		width: '100%',
		overflow: 'hidden',
		height: 230,
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
		alignItems: 'center',
		gap: 6,
	},
	legendLabel: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.89,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 200,
	},
});

