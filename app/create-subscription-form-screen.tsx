import ScreenBackButton from '@/components/buttons/screen-back-button';
import RecordSubscriptionForm from '@/components/form/record-subscription-form';
import { ScrollView } from 'react-native';

export default function CreateSubscriptionFormScreen() {
	return (
		<ScrollView className="pt-16 bg-white">
			<ScreenBackButton screenName="Record subscription" />
			<RecordSubscriptionForm />
		</ScrollView>
	);
}
