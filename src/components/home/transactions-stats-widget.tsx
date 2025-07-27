import { Text, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { CurveType, LineChart } from 'react-native-gifted-charts';

import * as schema from '@/db/schema';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

import WidgetWrapper from '../reusables/widget-wrapper';
import { eq } from 'drizzle-orm';

export default function TransactionsStartsWidget() {
	return (
		<WidgetWrapper customStyle={{ marginHorizontal: 16, marginVertical: 5 }}>
			<View style={styles.innerContainer}>
				<Text variant="bodyMedium" style={styles.title}>
					Your transactions this month
				</Text>

				<Stats />
			</View>
		</WidgetWrapper>
	);
}

function Stats() {
	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const { data: expenses } = useLiveQuery(
		drizzleDb
			.select()
			.from(schema.transactions)
			.where(eq(schema.transactions.type, 'expense'))
	);

	return (
		<LineChart
			data={[
				{ label: '1', value: 50 },
				{ label: '2', value: 20 },
				{ label: '3', value: 70 },
				{ label: '4', value: 60 },
				{ label: '5', value: 40 },
			]}
			data2={[
				{ label: '1', value: 20 },
				{ label: '2', value: 10 },
				{ label: '3', value: 40 },
				{ label: '4', value: 80 },
				{ label: '5', value: 60 },
			]}
			initialSpacing={0}
			spacing={40}
			thickness={2}
			hideRules
			showVerticalLines
			verticalLinesColor="rgba(255,2555,255,0.1)"
			xAxisColor={theme.colors.outlineVariant}
			yAxisColor={theme.colors.outlineVariant}
			color={theme.colors.primary}
			color1="rgb(255, 0, 0)"
			dataPointsColor1="rgb(255, 0, 0)"
			color2="rgb(0, 255, 0)"
			color3="rgb(0, 0, 255)"
			xAxisLabelTextStyle={{
				color: theme.colors.onBackground,
				fontFamily: 'Inter-Regular',
				fontSize: 9,
			}}
			yAxisTextStyle={{
				color: theme.colors.onBackground,
				fontFamily: 'Inter-Regular',
				fontSize: 9,
			}}
			isAnimated
			curved
			curveType={CurveType.QUADRATIC}
		/>
	);
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'Inter-Regular',
		opacity: 0.8,
	},
	innerContainer: {
		gap: 20,
	},
});

