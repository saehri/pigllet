import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Surface, Text, useTheme } from 'react-native-paper';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import moment from 'moment';
import { transactionColorMap } from '@/utils/utils';
import { TransactionIconsCatalogue } from '@/types/type';

import TransactionIcons from '../reusables/transaction-icons';

type Props = {
	selectedDate: Date;
	range: 'month' | 'year';
};

const borderRadius = {
	tr: {
		first: 24,
		middle: 6,
		only: 24,
		last: 6,
	},
	tl: {
		first: 24,
		middle: 6,
		only: 24,
		last: 6,
	},
	br: {
		first: 6,
		middle: 6,
		only: 24,
		last: 24,
	},
	bl: {
		first: 6,
		middle: 6,
		only: 24,
		last: 24,
	},
};

export default function SpendingByCategory({ selectedDate, range }: Props) {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	// set up the database
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const getSumByTypeInDateRange = () => {
		const whereConditions = [eq(schema.transactions.type, 'expense')];

		if (selectedDate && range) {
			whereConditions.push(
				gte(
					schema.transactions.created_at,
					moment(selectedDate).startOf(range).format('YYYY-MM-DD')
				)
			);
			whereConditions.push(
				lte(
					schema.transactions.created_at,
					moment(selectedDate).endOf(range).format('YYYY-MM-DD')
				)
			);
		}

		return drizzleDb
			.select({
				value: sql<number>`SUM(${schema.transactions.amount})`,
				label: schema.categories.label,
				iconName: schema.categories.icon_name,
			})
			.from(schema.transactions)
			.innerJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
			.groupBy(schema.categories.label);
	};

	const getMaxValue = () => {
		const whereConditions = [eq(schema.transactions.type, 'expense')];

		if (selectedDate && range) {
			whereConditions.push(
				gte(
					schema.transactions.created_at,
					moment(selectedDate).startOf(range).format('YYYY-MM-DD')
				)
			);
			whereConditions.push(
				lte(
					schema.transactions.created_at,
					moment(selectedDate).endOf(range).format('YYYY-MM-DD')
				)
			);
		}

		return drizzleDb
			.select({
				maxValue: sql<number>`MAX(${schema.transactions.amount})`,
			})
			.from(schema.transactions)
			.where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
	};

	const { data: chartData } = useLiveQuery(getSumByTypeInDateRange(), [
		selectedDate,
	]);
	const { data: chartMaxValue } = useLiveQuery(getMaxValue(), [selectedDate]);

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
				barWidth={65}
				barBorderRadius={120}
				formatYLabel={(label) =>
					`${Number(label).toLocaleString(
						getLocaleByCurrencySymbol(currentCurrencySymbol)
					)}`
				}
				height={200}
				maxValue={chartMaxValue[0].maxValue}
				data={chartData}
				frontColor={transactionColorMap.expense}
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
			/>

			<View style={styles.cardContainer}>
				{chartData.map((data, index) => (
					<CategoryCard
						key={data.label}
						iconName={data.iconName as keyof TransactionIconsCatalogue}
						label={data.label}
						value={`${currentCurrencySymbol} ${data.value.toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}`}
						position={
							chartData.length === 1
								? 'only'
								: index > 0 && index < chartData.length - 1
									? 'middle'
									: index === 0
										? 'first'
										: 'last'
						}
					/>
				))}
			</View>
		</View>
	);
}

type CategoryCardProps = {
	iconName: keyof TransactionIconsCatalogue;
	label: string;
	value: string;
	position: 'only' | 'first' | 'middle' | 'last';
};

function CategoryCard({ iconName, label, value, position }: CategoryCardProps) {
	return (
		<Surface
			mode="flat"
			elevation={5}
			style={[
				styles.categoryCard,
				{
					borderTopRightRadius: borderRadius.tr[position],
					borderTopLeftRadius: borderRadius.tl[position],
					borderBottomLeftRadius: borderRadius.bl[position],
					borderBottomRightRadius: borderRadius.br[position],
				},
			]}
		>
			<View style={styles.categoryCardIcon}>
				<TransactionIcons
					icon={iconName}
					color={transactionColorMap.expense}
					size={20}
				/>
			</View>

			<View style={styles.categoryCardContent}>
				<Text style={styles.categoryCardText} variant="bodyMedium">
					{label}
				</Text>

				<Text style={styles.categoryCardText} variant="bodyMedium">
					{value}
				</Text>
			</View>
		</Surface>
	);
}

const styles = StyleSheet.create({
	emptyAndLoadingContainer: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	chartContainer: {
		width: '100%',
		justifyContent: 'center',
	},
	cardContainer: {
		marginTop: 24,
		gap: 2,
	},
	categoryCard: {
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		paddingVertical: 9,
		paddingHorizontal: 12,
	},
	categoryCardIcon: {
		width: 30,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	categoryCardContent: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	categoryCardText: {
		fontFamily: 'Manrope-Regular',
	},
});

