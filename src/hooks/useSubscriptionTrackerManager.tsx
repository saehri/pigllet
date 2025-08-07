import { ToastAndroid } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import * as schema from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { SubscriptionBillingTypes } from '@/types/type';

import { useRouter } from 'expo-router';
import moment from 'moment';

type Props = {
	actionType: 'read' | 'create' | 'delete' | 'update';
	subscriptionId?: number;
};

type UseSubscriptionTrackerManagerTypes = {
	loading: boolean;
	loadSubscriptionsData: () => any;
	createSubscriptionRecord: () => Promise<void>;
	updateSubscriptionRecord: () => Promise<void>;
	deleteSubscriptionRecord: () => Promise<void>;
	subscriptionTitle: string;
	setSubscriptionTitle: Dispatch<SetStateAction<string>>;
	subscriptionAmount: string;
	setSubscriptionAmount: Dispatch<SetStateAction<string>>;
	subscriptionBilled: SubscriptionBillingTypes;
	setSubscriptionBilled: Dispatch<SetStateAction<SubscriptionBillingTypes>>;
	subscriptionDueDate: Date;
	setSubscriptionDueDate: Dispatch<SetStateAction<Date>>;
	subscriptionStartedAt: Date;
	setSubscriptionStartedAt: Dispatch<SetStateAction<Date>>;
};

export default function useSubscriptionTrackerManager({
	actionType,
	subscriptionId,
}: Props): UseSubscriptionTrackerManagerTypes {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const router = useRouter();

	// ----- form state
	const [loading, setLoading] = useState<boolean>(false);
	const [initialFormValue, setInitialFormValue] =
		useState<schema.Subscription>();

	// ---- form input state
	const [subscriptionTitle, setSubscriptionTitle] = useState<string>('');
	const [subscriptionAmount, setSubscriptionAmount] = useState<string>('');
	const [subscriptionBilled, setSubscriptionBilled] =
		useState<SubscriptionBillingTypes>('monthly');
	const [subscriptionDueDate, setSubscriptionDueDate] = useState<Date>(
		new Date()
	);
	const [subscriptionStartedAt, setSubscriptionStartedAt] = useState<Date>(
		new Date()
	);

	useEffect(() => {
		async function populateForm() {
			try {
				const data = await drizzleDb
					.select()
					.from(schema.subscriptions)
					.where(eq(schema.subscriptions.id, Number(subscriptionId)));

				setInitialFormValue(data[0]);
				const { amount, billed, due_date, name, started_at } = data[0];

				setSubscriptionTitle(name);
				setSubscriptionAmount(amount.toString());
				setSubscriptionBilled(billed as any);
				setSubscriptionDueDate(new Date(due_date));
				setSubscriptionStartedAt(new Date(started_at));
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			}
		}

		if (actionType === 'update') {
			populateForm();
		}
	}, []);

	// ----- READ
	const loadSubscriptionsData = () =>
		drizzleDb
			.select({
				id: schema.subscriptions.id,
				name: schema.subscriptions.name,
				amount: schema.subscriptions.amount,
				billed: schema.subscriptions.billed,
				started_at: schema.subscriptions.started_at,
				due_date: schema.subscriptions.due_date,
				elapsed_due_date: sql<number>`julianday(subscriptions.due_date) - julianday(${moment(new Date()).format('YYYY-MM-DD')})`,
			})
			.from(schema.subscriptions);

	// ----- CREATE
	async function createSubscriptionRecord() {
		try {
			setLoading(true);

			const payload: schema.Subscription = {
				name: subscriptionTitle,
				amount: Number(subscriptionAmount),
				started_at: moment(subscriptionStartedAt).format('YYYY-MM-DD'),
				due_date: moment(subscriptionDueDate).format('YYYY-MM-DD'),
				billed: subscriptionBilled,
			};

			await drizzleDb.insert(schema.subscriptions).values(payload);

			setSubscriptionTitle('');
			setSubscriptionAmount('');
			setSubscriptionAmount('');

			ToastAndroid.show('Subscriptions tracker created!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	// ------ UPDATE
	async function updateSubscriptionRecord() {
		try {
			if (!initialFormValue) return;
			setLoading(true);

			await drizzleDb
				.update(schema.subscriptions)
				.set({
					amount: Number(subscriptionAmount),
					billed: subscriptionBilled,
					name: subscriptionTitle,
					due_date: moment(subscriptionDueDate).format('YYYY-MM-DD'),
					started_at: moment(subscriptionStartedAt).format('YYYY-MM-DD'),
				})
				.where(eq(schema.subscriptions.id, Number(initialFormValue.id)));

			ToastAndroid.show('Changes saved!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	// ----- DELETE
	async function deleteSubscriptionRecord() {
		try {
			setLoading(true);

			await drizzleDb
				.delete(schema.subscriptions)
				.where(eq(schema.subscriptions.id, Number(subscriptionId)));

			ToastAndroid.show('Subscription record deleted!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
			router.back();
		}
	}

	return {
		subscriptionStartedAt,
		subscriptionDueDate,
		subscriptionAmount,
		subscriptionBilled,
		subscriptionTitle,
		loading,
		setSubscriptionTitle,
		setSubscriptionBilled,
		loadSubscriptionsData,
		setSubscriptionDueDate,
		setSubscriptionAmount,
		setSubscriptionStartedAt,
		updateSubscriptionRecord,
		createSubscriptionRecord,
		deleteSubscriptionRecord,
	};
}

