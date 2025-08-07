import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { and, asc, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import moment from 'moment';
import { transactionColorMap } from '@/utils/utils';
import { TransactionIconsCatalogue } from '@/types/type';

import TransactionIcons from '../reusables/transaction-icons';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react-native';

type Props = {
	selectedDate?: Date;
	range?: 'month' | 'year';
	type: schema.TransactionType;
	name: string;
	descriptions?: string;
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

export default function TransactionsByCategory({
	selectedDate,
	range,
	type,
	name,
	descriptions,
}: Props) {
	const theme = useTheme();

	// for ordering the data
	const [order, setOrder] = useState<'asc' | 'desc'>('desc');

	// set up the database
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const getSumByTypeInDateRange = () => {
		const whereConditions = [eq(schema.transactions.type, type)];

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
			.groupBy(schema.categories.label)
			.orderBy(
				order === 'desc'
					? desc(sql<number>`SUM(${schema.transactions.amount})`)
					: asc(sql<number>`SUM(${schema.transactions.amount})`)
			);
	};

	const getMaxValue = () => {
		const whereConditions = [eq(schema.transactions.type, type)];

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
				maxValue: sql<number>`SUM(${schema.transactions.amount})`,
			})
			.from(schema.transactions)
			.where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
	};

	const { data: chartData } = useLiveQuery(getSumByTypeInDateRange(), [
		selectedDate,
		order,
	]);
	const { data: chartMaxValue } = useLiveQuery(getMaxValue(), [selectedDate]);

	return (
		<Surface mode="flat" elevation={2} style={styles.chart}>
			<View style={styles.chartHeader}>
				<View>
					<Text style={styles.chartTitle} variant="bodyLarge">
						{name}
					</Text>
					<Text style={styles.chartSubtitle} variant="bodyMedium">
						{descriptions}
					</Text>
				</View>

				<Button
					mode="contained-tonal"
					contentStyle={{ height: 40 }}
					onPress={() => setOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
				>
					{order === 'desc' ? (
						<ArrowDownIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					) : (
						<ArrowUpIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					)}
				</Button>
			</View>

			{chartData.length ? (
				<ChartRenderer
					chartData={chartData}
					chartMaxValue={chartMaxValue[0].maxValue}
					transactionType={type}
				/>
			) : (
				<View style={styles.emptyAndLoadingContainer}>
					<Text
						variant="bodyLarge"
						style={{ fontFamily: 'Manrope-Regular', opacity: 0.5 }}
					>
						No data available to display at the moment.
					</Text>
				</View>
			)}
		</Surface>
	);
}

type ChartRendererProps = {
	chartData: { value: number; label: string; iconName: string }[];
	chartMaxValue: number;
	transactionType: schema.TransactionType;
};

function ChartRenderer({
	chartData,
	chartMaxValue,
	transactionType,
}: ChartRendererProps) {
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const theme = useTheme();

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
				maxValue={chartMaxValue}
				data={chartData}
				frontColor={transactionColorMap[transactionType]}
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
						transactionType={transactionType}
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

// =================================================
type CategoryCardProps = {
	iconName: keyof TransactionIconsCatalogue;
	label: string;
	value: string;
	position: 'only' | 'first' | 'middle' | 'last';
	transactionType: schema.TransactionType;
};

function CategoryCard({
	iconName,
	label,
	value,
	position,
	transactionType,
}: CategoryCardProps) {
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
					color={transactionColorMap[transactionType]}
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
	chart: {
		padding: 24,
		borderRadius: 40,
		gap: 16,
	},
	chartHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	chartTitle: {
		fontFamily: 'Manrope-SemiBold',
	},
	chartSubtitle: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
	},
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

