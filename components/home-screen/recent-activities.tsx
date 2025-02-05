import { Text, TouchableOpacity, View } from 'react-native';
import ArrowRightIcon from '@/assets/svg/arrow/keyboard-arrow-right.svg';
import ActivityCard from './activity-card';
import { ExpenseDataTypes } from '@/context/ExpensesProvider';

interface RecentActivities {
	activities: ExpenseDataTypes[];
	showDetailsButton: boolean;
}

export default function RecentActivities({
	activities,
	showDetailsButton,
}: RecentActivities) {
	if (activities.length === 0) {
		return (
			<View
				className="flex-1 w-full pb-8 px-6 bg-white gap-2"
				style={{ paddingTop: 16 }}
			>
				<View className="flex-row justify-between items-center">
					<Text
						className="text-slate-900 font-bold text-lg tracking-tight"
						style={{ fontWeight: 800 }}
					>
						Recent Activity
					</Text>
				</View>

				<View className="p-6 border border-red-100 border-dashed rounded-xl">
					<Text className="text-center text-slate-500">
						No record found, let's create a new one!
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View className="flex-1 w-full pb-8 bg-white" style={{ paddingTop: 16 }}>
			<View className="flex-row justify-between items-center px-6">
				<Text
					className="text-slate-900 font-bold text-lg tracking-tight"
					style={{ fontWeight: 800 }}
				>
					Recent Activity
				</Text>

				{showDetailsButton && (
					<TouchableOpacity className="flex-row items-center">
						<Text className="text-slate-600 text-lg tracking-tight">
							Details
						</Text>
						<ArrowRightIcon />
					</TouchableOpacity>
				)}
			</View>

			<View id="activity" className="flex-col" style={{ marginTop: 8 }}>
				{activities.map((activity) => (
					<ActivityCard
						transactionType={activity.transaction_type}
						category={activity.category}
						date={activity.paid_at}
						description={activity.description}
						total={activity.total}
						wallet={activity.wallet.wallet_name}
						key={activity.id}
						id={activity.id}
					/>
				))}
			</View>
		</View>
	);
}
