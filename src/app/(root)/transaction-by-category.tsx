import { Text } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import * as schema from '@/db/schema';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { alias } from 'drizzle-orm/sqlite-core';
import { toYYYYMMDD } from '@/utils/utils';
import { and, eq, sql } from 'drizzle-orm';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import ChartFooter from '@/src/components/charts/chart-footer';
import ChartWrapper from '@/src/components/charts/chart-wrapper';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import TransactionsSummaryChart from '@/src/components/charts/transactions-summary-chart';

export default function TransactionByCategoryScreen() {
	const navigation = useNavigation();

	const { categoryId, categoryName } = useLocalSearchParams();

	useEffect(() => {
		navigation.setOptions({
			title: categoryName,
		});
	}, []);

	return <View></View>;
}

const styles = StyleSheet.create({
	chartWrapperContainer: {
		padding: 16,
		paddingBottom: 24,
	},
	renderItem: { paddingBottom: 18, gap: 8 },
	renderItemHeader: {
		fontFamily: 'Manrope-Regular',
		paddingHorizontal: 16,
		fontSize: 18,
	},
});

