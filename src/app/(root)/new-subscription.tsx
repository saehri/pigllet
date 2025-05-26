import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import NewSubscriptionForm from '@/src/components/forms/subscription/new-subscription-form';

export default function NewSubscription() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background }}
			showsVerticalScrollIndicator={false}
		>
			<View>
				<NewSubscriptionForm />
			</View>
		</ScrollView>
	);
}

