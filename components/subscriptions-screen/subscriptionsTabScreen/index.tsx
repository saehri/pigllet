import { View } from 'react-native';

import Calendar from './calendar';
import SubscriptionsList from '../subscriptions-list';

interface SubscriptionsTabScreen {
	selectedYear: number;
	selectedMonth: number;
	selectedDate: Date;
}

export default function SubscriptionTabScreen({
	selectedMonth,
	selectedYear,
	selectedDate,
}: SubscriptionsTabScreen) {
	return (
		<View>
			<Calendar selectedYear={selectedYear} selectedMonth={selectedMonth} />
			<SubscriptionsList selectedDate={selectedDate} />
		</View>
	);
}
