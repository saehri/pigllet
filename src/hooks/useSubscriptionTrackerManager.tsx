import { ToastAndroid } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SubscriptionBillingTypes } from '@/types/type';
import { toYYYYMMDD } from '@/utils/utils';
import { eq } from 'drizzle-orm';

type Props = {
	actionType: 'read' | 'create' | 'delete' | 'update';
	subscriptionId?: number;
};

type UseSubscriptionTrackerManagerTypes = {
	loading: boolean;
	loadSubscriptionsData: () => any;
	userAccounts: schema.Account[];
	createSubscriptionRecord: () => Promise<void>;
	subscriptionTitle: string;
	setSubscriptionTitle: Dispatch<SetStateAction<string>>;
	subscriptionAmmount: string;
	setSubscriptionAmmount: Dispatch<SetStateAction<string>>;
	subscriptionBilled: SubscriptionBillingTypes;
	setSubscriptionBilled: Dispatch<SetStateAction<SubscriptionBillingTypes>>;
	subscriptionsPaymentAccount: schema.Account | undefined;
	setSubscriptionPaymentAccount: Dispatch<
		SetStateAction<schema.Account | undefined>
	>;
	subscriptionDueDate: Date;
	setSubscriptionDueDate: Dispatch<SetStateAction<Date>>;
	subscriptionStartedAt: Date;
	setSubscriptionStartedAt: Dispatch<SetStateAction<Date>>;
};

export default function useSubscriptionTrackerManager({
	actionType,
}: Props): UseSubscriptionTrackerManagerTypes {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	// ----- form state
	const [loading, setLoading] = useState<boolean>(false);

	const [userAccounts, setUserAccounts] = useState<schema.Account[]>([]);

	// ---- form input state
	const [subscriptionTitle, setSubscriptionTitle] = useState<string>('');
	const [subscriptionAmmount, setSubscriptionAmmount] = useState<string>('');
	const [subscriptionBilled, setSubscriptionBilled] =
		useState<SubscriptionBillingTypes>('monthly');
	const [subscriptionsPaymentAccount, setSubscriptionPaymentAccount] =
		useState<schema.Account>();
	const [subscriptionDueDate, setSubscriptionDueDate] = useState<Date>(
		new Date()
	);
	const [subscriptionStartedAt, setSubscriptionStartedAt] = useState<Date>(
		new Date()
	);

	// ---- set up the form
	useEffect(() => {
		async function populateForm() {
			try {
				const userAccounts = await drizzleDb.select().from(schema.accounts);

				setUserAccounts(userAccounts);
				setSubscriptionPaymentAccount(userAccounts[0]);
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			}
		}

		if (actionType !== 'read') {
			populateForm();
		}
	}, []);

	// ----- READ
	const loadSubscriptionsData = () =>
		drizzleDb.select().from(schema.subscriptions);

	// ----- CREATE
	async function createSubscriptionRecord() {
		try {
			setLoading(true);

			if (!subscriptionsPaymentAccount) return;

			const payload: schema.Subscription = {
				name: subscriptionTitle,
				account_id: Number(subscriptionsPaymentAccount?.id),
				amount: Number(subscriptionAmmount),
				started_at: toYYYYMMDD(subscriptionStartedAt),
				due_date: toYYYYMMDD(subscriptionDueDate),
				billed: subscriptionBilled,
			};

			await drizzleDb.insert(schema.subscriptions).values(payload);

			// ---- reduce the selected account balance if the user start their subscription today
			if (subscriptionStartedAt.getDate() === new Date().getDate()) {
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							subscriptionsPaymentAccount.balance - Number(subscriptionAmmount),
					})
					.where(
						eq(schema.accounts.id, Number(subscriptionsPaymentAccount.id))
					);
			}

			setSubscriptionTitle('');
			setSubscriptionAmmount('');
			setSubscriptionAmmount('');

			ToastAndroid.show('Subscriptions tracker created!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	return {
		subscriptionsPaymentAccount,
		subscriptionStartedAt,
		subscriptionDueDate,
		subscriptionAmmount,
		subscriptionBilled,
		subscriptionTitle,
		userAccounts,
		loading,
		setSubscriptionTitle,
		setSubscriptionBilled,
		loadSubscriptionsData,
		setSubscriptionDueDate,
		setSubscriptionAmmount,
		setSubscriptionStartedAt,
		createSubscriptionRecord,
		setSubscriptionPaymentAccount,
	};
}

