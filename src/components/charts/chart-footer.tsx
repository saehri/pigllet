import { useContext, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { EyeClosedIcon, EyeIcon } from 'lucide-react-native';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import { Category, Transaction } from '@/db/schema';
import {
	getChartDataByCategory,
	getChartDataByDate,
} from '@/utils/group-transactions';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

interface TransactionWithCategory extends Transaction {
	category?: Category;
}

type Props = {
	transactions: TransactionWithCategory[];
	groupBy: 'date' | 'category';
};

export default function ChartFooter({
	transactions,
	groupBy = 'category',
}: Props) {
	const theme = useTheme();

	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const [maximize, setMaximize] = useState(false);
	const [sortedData, setSortedData] = useState<
		{ label: string; value: number }[]
	>([]);

	useEffect(() => {
		async function load() {
			try {
				if (groupBy === 'category') {
					const data = await getChartDataByCategory(transactions);
					setSortedData(data);
				} else {
					const data = await getChartDataByDate(transactions);
					setSortedData(data);
				}
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			}
		}

		load();
	}, []);

	const transactionsSum = sortedData
		.map((bl) => bl.value)
		.reduce((a, b) => a + b, 0);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text
					style={[styles.title, { borderColor: theme.colors.outlineVariant }]}
					variant="titleMedium"
				>
					Summary
				</Text>

				<Button
					style={styles.maximizeButton}
					mode="elevated"
					compact
					onPress={() => setMaximize(!maximize)}
				>
					{maximize ? (
						<EyeIcon size={16} strokeWidth={1.5} color={theme.colors.primary} />
					) : (
						<EyeClosedIcon
							size={16}
							strokeWidth={1.5}
							color={theme.colors.primary}
						/>
					)}
				</Button>
			</View>

			<View
				style={{
					height: maximize ? 'auto' : 45,
					overflow: 'hidden',
					display: !sortedData.length ? 'none' : 'flex',
				}}
			>
				<View
					style={[
						styles.summaryContainer,
						{ borderColor: theme.colors.outlineVariant },
					]}
				>
					{sortedData.map((data, i) => (
						<View
							style={[
								styles.summaryItem,
								{ borderColor: theme.colors.outlineVariant },
							]}
							key={i}
						>
							<Text
								textBreakStrategy="balanced"
								numberOfLines={1}
								style={styles.summaryItemText}
							>
								{data.label}
							</Text>
							<Text
								textBreakStrategy="balanced"
								numberOfLines={1}
								style={styles.summaryItemText}
							>
								{`${currentCurrencySymbol} ${data.value.toLocaleString(getLocaleByCurrencySymbol(currentCurrencySymbol))}`}
							</Text>
						</View>
					))}

					<View
						style={[
							styles.totalItem,
							{ borderColor: theme.colors.outlineVariant },
						]}
					>
						<Text textBreakStrategy="balanced" style={styles.summaryItemText}>
							Total
						</Text>
						<Text textBreakStrategy="balanced" style={styles.summaryItemText}>
							{`${currentCurrencySymbol} ${transactionsSum.toLocaleString(getLocaleByCurrencySymbol(currentCurrencySymbol))}`}
						</Text>
					</View>
				</View>

				<LinearGradient
					colors={[theme.colors.elevation.level3, 'transparent']}
					style={[styles.linearGradient, { height: maximize ? 0 : 35 }]}
					start={{ x: 0, y: 1 }}
					end={{ x: 0, y: 0 }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginTop: 16,
	},
	title: {
		fontFamily: 'Inter-Regular',
		// borderBottomWidth: 1,
		// paddingBottom: 8,
	},
	maximizeButton: { position: 'absolute', bottom: 8, right: 8 },
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 16,
		paddingTop: 0,
	},
	summaryContainer: {
		padding: 16,
		borderTopWidth: 1,
		paddingTop: 0,
	},
	linearGradient: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
	},
	summaryItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
		borderBottomWidth: 1,
	},
	summaryItemText: {
		fontFamily: 'Inter-Regular',
		maxWidth: 200,
	},
	totalItem: {
		paddingVertical: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		marginTop: 4,
	},
});

