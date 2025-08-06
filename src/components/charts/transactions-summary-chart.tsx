import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';

import { transactionColorMap } from '@/utils/utils';
import { getStackedChartDataByDate } from '@/utils/group-transactions';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';

type Props = {
	selectedDate: Date;
	range?: 'month' | 'year';
};

export default function TransactionsSummaryChart({
	selectedDate,
	range,
}: Props) {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const { data: transactions } = useLiveQuery(
		loadTransactionsData(selectedDate, range),
		[selectedDate]
	);

	if (!transactions.length) {
		return (
			<View style={styles.emptyAndLoadingContainer}>
				<Text
					variant="bodyLarge"
					style={{ fontFamily: 'Manrope-Regular', opacity: 0.5 }}
				>
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
				stackData={getStackedChartDataByDate(
					transactions,
					range === 'month'
						? 'MMM D, YYYY'
						: range === 'year'
							? 'MMM, YYYY'
							: 'YYYY'
				)}
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
				formatYLabel={(label) =>
					`${Number(label).toLocaleString(
						getLocaleByCurrencySymbol(currentCurrencySymbol)
					)}`
				}
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
		marginBottom: 16,
	},
	chartContainer: {
		paddingLeft: 16,
		width: '100%',
		overflow: 'hidden',
		height: 230,
		marginBottom: 16,
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

