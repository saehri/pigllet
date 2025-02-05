import { SubscriptionDataTypes } from '@/context/SubscriptionProvider';
import { useRouter } from 'expo-router';
import { Text, TouchableHighlight, View } from 'react-native';

const SubscriptionsCard = (props: SubscriptionDataTypes) => {
	const labelColor = props.is_paid === 'paid' ? 'bg-[#3AC100]' : 'bg-red-600';

	const dueDate = new Date(props.due_date);
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		weekday: 'short',
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(dueDate);

	const router = useRouter();

	return (
		<TouchableHighlight
			className="flex-row justify-between gap-6 items-start pt-3 pb-3 px-6"
			onPress={() => router.push(`/subscription-details/${props.id}`)}
			activeOpacity={0.9}
			underlayColor="#eaeaea"
		>
			<View className="flex-row justify-between w-full">
				<View>
					<Text className="text-lg text-slate-900 tracking-tight">
						{props.description}
					</Text>
					<Text className="text-slate-600 tracking-tight">
						Due {formattedDate}
					</Text>
				</View>

				<View className="items-end">
					<Text
						className={`tracking-tight text-xs rounded-full px-3 p-[2px] capitalize text-white ${labelColor}`}
					>
						{props.is_paid}
					</Text>

					<Text className="text-lg tracking-tight">
						Rp {props.total.toLocaleString('id-ID')}
					</Text>
				</View>
			</View>
		</TouchableHighlight>
	);
};

export default SubscriptionsCard;
