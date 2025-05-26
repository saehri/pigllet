import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { FlatList, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';
import { useContext } from 'react';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import useSubscriptionTrackerManager from '@/src/hooks/useSubscriptionTrackerManager';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

export default function SubscriptionScreen(props: any) {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const { loadSubscriptionsData } = useSubscriptionTrackerManager({
		actionType: 'read',
	});

	const { data: subscriptions }: { data: schema.Subscription[] } = useLiveQuery(
		loadSubscriptionsData()
	);

	return (
		<FlatList
			ListEmptyComponent={<NoItemNotice />}
			style={{ backgroundColor: theme.colors.background }}
			showsVerticalScrollIndicator={false}
			data={subscriptions}
			renderItem={({ item }) => (
				<Surface
					elevation={3}
					mode="flat"
					style={{
						padding: 16,
						marginHorizontal: 16,
						borderWidth: 1,
						borderColor: theme.colors.outlineVariant,
						borderRadius: 16,
						flexDirection: 'row',
						alignItems: 'flex-end',
						justifyContent: 'space-between',
					}}
				>
					<View>
						<Text
							style={{
								fontFamily: 'Inter-Medium',
								marginBottom: 8,
								color: theme.colors.primary,
							}}
							variant="titleMedium"
						>
							{item.name}
						</Text>

						<Text style={{ fontFamily: 'Inter-Regular' }} variant="labelLarge">
							{`${currentCurrencySymbol} ${item.amount.toLocaleString(
								getLocaleByCurrencySymbol(currentCurrencySymbol)
							)}`}
						</Text>

						<Text style={{ fontFamily: 'Inter-Regular' }} variant="labelLarge">
							Paid {item.billed}
						</Text>
					</View>

					<View>
						<Text style={{ fontFamily: 'Inter-Regular' }} variant="labelLarge">
							Start{' '}
							{new Date(item.started_at).toLocaleDateString('en-US', {
								dateStyle: 'medium',
							})}
						</Text>
						<Text style={{ fontFamily: 'Inter-Regular' }} variant="labelLarge">
							Next{' '}
							{new Date(item.due_date).toLocaleDateString('en-US', {
								dateStyle: 'medium',
							})}
						</Text>
					</View>
				</Surface>
			)}
		/>
	);
}

