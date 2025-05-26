import { useEffect } from 'react';
import { useTheme } from 'react-native-paper';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ScrollView, View } from 'react-native';
import EditSubscriptionForm from '@/src/components/forms/subscription/edit-subscription-form';
import DeleteSubscriptionDialog from '@/src/components/reusables/delete-subscription-dialog';

export default function EditSubscription() {
	const theme = useTheme();
	const navigation = useNavigation();
	const { id } = useLocalSearchParams();

	useEffect(() => {
		navigation.setOptions({
			title: '',
			headerRight: () => (
				<View
					style={{
						backgroundColor: theme.colors.background,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<DeleteSubscriptionDialog subscriptionId={Number(id)} />
				</View>
			),
		});
	}, []);

	return (
		<ScrollView style={{ backgroundColor: theme.colors.background }}>
			<EditSubscriptionForm subscriptionId={Number(id)} />
		</ScrollView>
	);
}

