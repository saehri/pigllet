import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'SUBSCRIPTIONS';

export type SubscriptionDataTypes = {
	id: number;
	description: string;
	total: number;
	due_date: string;
	is_paid: 'paid' | 'unpaid';
};

export interface SubscriptionContextTypes {
	loading: boolean;
	allSubscriptions: SubscriptionDataTypes[];
	saveSubscription: (payload: SubscriptionDataTypes) => void;
	deleteSubscriptionById: (id: number) => void;
	getSubscriptionsByDate: (date: Date) => SubscriptionDataTypes[] | [];
	getSubscriptionsByMonth: (date: Date) => SubscriptionDataTypes[] | [];
	getSubscriptionById: (id: number) => SubscriptionDataTypes;
	updateSubscription: (payload: SubscriptionDataTypes, id: number) => {};
	clearData: () => void;
	getMonthlyTotal: (date: Date) => number;
}

export const SubscriptionContext = createContext<
	SubscriptionContextTypes | undefined
>(undefined);

const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
	const [allSubscriptions, setSubscriptions] = useState<
		SubscriptionDataTypes[]
	>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		loadSubscriptions();
	}, []);

	const loadSubscriptions = async () => {
		try {
			const storedSubscriptions = await AsyncStorage.getItem(STORAGE_KEY);
			if (storedSubscriptions) {
				setSubscriptions(JSON.parse(storedSubscriptions));
			}
		} catch (error) {
			console.log('Failed to load allSubscriptions:', error);
		} finally {
			setLoading(false);
		}
	};

	const saveSubscription = async (payload: SubscriptionDataTypes) => {
		try {
			setLoading(true);
			const newData = [payload, ...allSubscriptions];
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
			setSubscriptions((prevData) => [payload, ...prevData]);
			return { success: true };
		} catch (error) {
			console.log('Failed to save subscription:', error);
			return { success: false };
		} finally {
			setLoading(false);
		}
	};

	const deleteSubscriptionById = async (id: number) => {
		try {
			setLoading(true);
			const newData = allSubscriptions.filter((sub) => sub.id !== id);
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
			setSubscriptions(newData);
		} catch (error) {
			console.log('Failed to delete subscription:', error);
		} finally {
			setLoading(false);
		}
	};

	const getSubscriptionsByDate = (date: Date) => {
		try {
			return allSubscriptions.filter((sub) => {
				const subDate = new Date(sub.due_date);
				return (
					subDate.getDate() === date.getDate() &&
					subDate.getMonth() === date.getMonth() &&
					subDate.getFullYear() === date.getFullYear()
				);
			});
		} catch (error) {
			console.log('Failed to filter allSubscriptions by date:', error);
			return [];
		}
	};

	const getSubscriptionsByMonth = (date: Date) => {
		try {
			return allSubscriptions.filter((sub) => {
				const subDate = new Date(sub.due_date);
				return (
					subDate.getMonth() === date.getMonth() &&
					subDate.getFullYear() === date.getFullYear()
				);
			});
		} catch (error) {
			console.log('Failed to filter allSubscriptions by month:', error);
			return [];
		}
	};

	const getSubscriptionById = (id: number): SubscriptionDataTypes => {
		const subscription = allSubscriptions.find((sub) => sub.id === id);
		if (!subscription) {
			throw new Error(`Subscription with id ${id} not found`);
		}
		return subscription;
	};

	const updateSubscription = async (
		payload: SubscriptionDataTypes,
		id: number
	) => {
		try {
			setLoading(true);
			const subscription = allSubscriptions.filter((s) => s.id === id)[0];
			subscription.description = payload.description;
			subscription.due_date = payload.due_date;
			subscription.is_paid = payload.is_paid;
			subscription.total = payload.total;

			const newData = [
				subscription,
				...allSubscriptions.filter((sub) => sub.id !== id),
			];

			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
			setSubscriptions(newData);
			return { success: true };
		} catch (error) {
			console.log('Failed to update subscription:', error);
			return { success: false };
		} finally {
			setLoading(false);
		}
	};

	const clearData = async () => {
		try {
			await AsyncStorage.removeItem(STORAGE_KEY);
			setSubscriptions([]);
		} catch (error) {
			console.log('Failed to clear subscription data:', error);
		}
	};

	const getMonthlyTotal = (date: Date) => {
		try {
			return allSubscriptions
				.filter((sub) => {
					const subDate = new Date(sub.due_date);
					return (
						subDate.getMonth() === date.getMonth() &&
						subDate.getFullYear() === date.getFullYear()
					);
				})
				.reduce((total, sub) => total + sub.total, 0);
		} catch (error) {
			console.log('Failed to calculate monthly total:', error);
			return 0;
		}
	};

	return (
		<SubscriptionContext.Provider
			value={{
				loading,
				allSubscriptions,
				saveSubscription,
				deleteSubscriptionById,
				getSubscriptionsByDate,
				getSubscriptionsByMonth,
				getSubscriptionById,
				updateSubscription,
				clearData,
				getMonthlyTotal,
			}}
		>
			{children}
		</SubscriptionContext.Provider>
	);
};

export default SubscriptionProvider;
