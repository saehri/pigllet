import { View } from 'react-native';
import React, { useContext, useState } from 'react';
import SummarySubscription from './summary-subscription';
import SubscriptionsList from '../subscriptions-list';
import LineCharts from '@/components/linecharts';
import { chartDataTransformerSubs } from '@/utils/chart-data-transformer';
import {
	SubscriptionContext,
	SubscriptionContextTypes,
} from '@/context/SubscriptionProvider';

const AnalyticsTabScreen = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const { getSubscriptionsByMonth } = useContext(
		SubscriptionContext
	) as SubscriptionContextTypes;

	return (
		<View>
			<LineCharts
				data={chartDataTransformerSubs(getSubscriptionsByMonth(selectedDate))}
				currentDate={selectedDate}
			/>

			<SummarySubscription />

			<SubscriptionsList selectedDate={selectedDate} />
		</View>
	);
};

export default AnalyticsTabScreen;
