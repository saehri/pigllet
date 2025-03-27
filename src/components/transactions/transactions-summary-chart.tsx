import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	MD3Theme,
	Surface,
	useTheme,
} from 'react-native-paper';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import { Transaction } from '@/db/schema';
import { groupTransactionsByCategory } from '@/utils/group-transactions';
import { ToastAndroid, View } from 'react-native';

type Props = {
	transactions: Transaction[];
	header?: React.ReactNode;
};

export default function TransactionsSummaryChart({
	transactions,
	header,
}: Props) {
	const theme = useTheme();

	const [chartData, setChartData] = useState<barDataItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);

				const data = await groupTransactionsByCategory(transactions);
				setChartData(data);
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, []);

	// hide the chart if there are no transactions
	if (transactions.length <= 0) return <View></View>;

	// loading indicator
	if (loading) {
		return (
			<Wrapper theme={theme}>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ActivityIndicator size={20} color={theme.colors.onSurface} />
				</View>
			</Wrapper>
		);
	}

	return (
		<Wrapper theme={theme}>
			{header}

			<BarChart
				data={chartData}
				frontColor={theme.colors.primary} // Main color for bars
				rulesThickness={1} // Thin grid lines for subtlety
				rulesColor={'rgba(255, 255, 255, .2)'} // Grid color matching the theme
				barWidth={28} // Adjust bar width for proportionate spacing
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
		</Wrapper>
	);
}

type WrapperProps = {
	children: React.ReactNode;
	theme: MD3Theme;
};

function Wrapper({ children, theme }: WrapperProps) {
	return (
		<Surface
			mode="flat"
			elevation={4}
			style={{
				borderRadius: 20,
				overflow: 'hidden',
				padding: 16,
				paddingTop: 10,
				alignItems: 'center',
				height: 288,
				borderWidth: 1,
				borderColor: theme.colors.outlineVariant,
			}}
		>
			{children}
		</Surface>
	);
}
