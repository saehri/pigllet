import { useContext, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import AnalyticsTabScreen from '@/components/subscriptions-screen/analyticsTabScreen';
import SubscriptionTabScreen from '@/components/subscriptions-screen/subscriptionsTabScreen';
import TopTabNavigation from '@/components/top-tab-navigation';
import CustomDatePicker from '@/components/custom-date-picker';
import {
	SubscriptionContext,
	SubscriptionContextTypess,
} from '@/context/SubscriptionProvider';

export default function SubscriptionScreen() {
	const [selectedTab, setSelectedTab] = useState<'subscriptions' | 'analytics'>(
		'subscriptions'
	);

	const tabs = [
		{
			label: 'subscriptions',
			text: 'Subscriptions',
			selectedTab: selectedTab,
			setSelectedTab: setSelectedTab,
		},
		{
			label: 'analytics',
			text: 'Analytics',
			selectedTab: selectedTab,
			setSelectedTab: setSelectedTab,
		},
	];

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 150 }}
			className="flex-1 w-full bg-white pt-16"
		>
			<TopTabNavigation tabs={tabs as any} />

			<PageToRender identifier={selectedTab} />
		</ScrollView>
	);
}

interface PageToRender {
	identifier: 'subscriptions' | 'analytics';
}

function PageToRender({ identifier }: PageToRender) {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();
	const { getMonthlyTotal } = useContext(
		SubscriptionContext
	) as SubscriptionContextTypess;

	return (
		<View>
			<View className="flex-row justify-between mb-8 px-6">
				<View>
					<Text className="text-base text-slate-600 tracking-tight">
						Your total this month
					</Text>

					<Text
						className="text-2xl text-[#FF2C4A] tracking-tight"
						style={{ fontWeight: 800 }}
					>
						Rp {getMonthlyTotal(currentDate).toLocaleString('id-ID')}
					</Text>
				</View>

				<CustomDatePicker
					displayDate={true}
					currentDate={currentDate}
					setDate={setCurrentDate}
				/>
			</View>

			{identifier === 'subscriptions' ? (
				<SubscriptionTabScreen
					selectedMonth={currentMonth}
					selectedYear={currentYear}
					selectedDate={currentDate}
				/>
			) : (
				<AnalyticsTabScreen />
			)}
		</View>
	);
}
