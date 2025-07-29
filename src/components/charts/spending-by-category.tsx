import { useContext, useEffect, useState } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';
import { getChartDataByCategory } from '@/utils/group-transactions';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

type Props = {
	selectedDate: Date;
};

export default function SpendingByCategory({ selectedDate }: Props) {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const { data: transactions } = useLiveQuery(
		loadTransactionsData(selectedDate, 'month', 'expense'),
		[selectedDate]
	);

	const [loading, setLoading] = useState(true);
	const [chartData, setChartData] = useState<any[]>([]);

	useEffect(() => {
		async function load() {
			try {
				const data = await getChartDataByCategory(transactions);
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
				barBorderRadius={120}
				formatYLabel={(label) =>
					`${Number(label).toLocaleString(
						getLocaleByCurrencySymbol(currentCurrencySymbol)
					)}`
				}
				yAxisLabelSuffix="K"
				data={chartData}
				frontColor={theme.colors.secondary}
				spacing={10}
				rulesThickness={0}
				xAxisThickness={0}
				yAxisThickness={0}
				yAxisTextStyle={{
					fontFamily: 'Manrope-Regular',
					fontSize: 9,
					color: theme.colors.onBackground,
				}}
				xAxisLabelTextStyle={{
					fontFamily: 'Manrope-Regular',
					textTransform: 'capitalize',
					fontSize: 10,
					color: theme.colors.onBackground,
				}}
				isAnimated
				animationDuration={0.5}
				autoCenterTooltip
				adjustToWidth
				renderTooltip={(item: any) => {
					return (
						<View
							style={{
								marginBottom: 0,
								backgroundColor: theme.colors.secondaryContainer,
								paddingHorizontal: 6,
								paddingVertical: 4,
								borderRadius: 4,
							}}
						>
							<Text
								style={{
									fontFamily: 'Manrope-Regular',
									fontSize: 8,
									color: theme.colors.onSecondaryContainer,
								}}
							>
								{`${currentCurrencySymbol} ${(item.value * 1000).toLocaleString(
									getLocaleByCurrencySymbol(currentCurrencySymbol)
								)}`}
							</Text>
						</View>
					);
				}}
			/>
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
		width: '100%',
		height: 230,
		justifyContent: 'center',
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

