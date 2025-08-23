import { ToastAndroid } from 'react-native';
import { SetStateAction, useEffect, useState } from 'react';

import * as schema from '@/db/schema';
import { asc, eq, sql } from 'drizzle-orm';

import { useRouter } from 'expo-router';
import moment from 'moment';
import { useDrizzleDB } from './useDrizzleDb';

export const loadBudgetRecord = (selectedDate: moment.MomentInput) => {
	const drizzleDb = useDrizzleDB();

	const startDate = moment(selectedDate).startOf('month').format('YYYY-MM-DD');
	const endDate = moment(selectedDate).endOf('month').format('YYYY-MM-DD');

	return drizzleDb
		.select({
			budget: {
				id: schema.budgets.id,
				category_id: schema.budgets.category_id,
				created_at: schema.budgets.created_at,
				limit: schema.budgets.limit,
				period: schema.budgets.period,
			},
			category: {
				id: schema.categories.id,
				icon_name: schema.categories.icon_name,
				label: schema.categories.label,
				type: schema.categories.type,
			},
		})
		.from(schema.budgets)
		.where(
			sql`DATE(${schema.budgets.created_at}) BETWEEN DATE(${startDate}) AND DATE(${endDate})`
		)
		.innerJoin(
			schema.categories,
			eq(schema.budgets.category_id, schema.categories.id)
		)
		.orderBy(asc(schema.budgets.category_id));
};

type UseBudgetManagerTypes = {
	loading: boolean;
	createBudgetRecord: () => Promise<void>;
	updateBudgetRecord: (id: number) => Promise<void>;
	deleteBudgetRecord: (id: number) => Promise<void>;
	budgetCategory: schema.Category | undefined;
	budgetPeriod: Date;
	budgetCreatedAt: Date;
	budgetLimit: string;
	currentBudgetSpending: string;
	setBudgetCategory: React.Dispatch<
		React.SetStateAction<schema.Category | undefined>
	>;
	setBudgetLimit: React.Dispatch<React.SetStateAction<string>>;
	setBudgetSpending: React.Dispatch<React.SetStateAction<string>>;
	setBudgetCreatedAt: React.Dispatch<React.SetStateAction<Date>>;
	setBudgetPeriod: React.Dispatch<SetStateAction<Date>>;
};

export default function useBudgetManager(): UseBudgetManagerTypes {
	const drizzleDb = useDrizzleDB();
	const router = useRouter();

	// ---- form state
	const [loading, setLoading] = useState<boolean>(false);

	// ---- form input states
	const [budgetLimit, setBudgetLimit] = useState<string>('');
	const [budgetCategory, setBudgetCategory] = useState<schema.Category>();
	const [budgetPeriod, setBudgetPeriod] = useState(new Date());
	const [budgetCreatedAt, setBudgetCreatedAt] = useState<Date>(new Date());
	const [currentBudgetSpending, setBudgetSpending] = useState<string>('');

	// ----- CREATE
	async function createBudgetRecord() {
		try {
			if (!budgetCategory) return;

			setLoading(true);

			const payload: schema.Budget = {
				category_id: Number(budgetCategory.id),
				created_at: moment(new Date()).format('YYYY-MM-DD'),
				limit: Number(budgetLimit),
				period: moment(new Date()).format('YYYY-MM-DD'),
			};

			await drizzleDb
				.insert(schema.budgets)
				.values(payload)
				.onConflictDoNothing();

			setBudgetLimit('');

			ToastAndroid.show('Budget created!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	// ---- UPDATE
	async function updateBudgetRecord(budgetId: number) {
		try {
			setLoading(true);

			await drizzleDb
				.update(schema.budgets)
				.set({
					category_id: budgetCategory?.id,
					limit: Number(budgetLimit),
				})
				.where(eq(schema.budgets.id, Number(budgetId)));

			ToastAndroid.show('Changes saved', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	// ----- DELETE
	async function deleteBudgetRecord(budgetId: number) {
		try {
			setLoading(true);

			await drizzleDb
				.delete(schema.budgets)
				.where(eq(schema.budgets.id, budgetId));

			ToastAndroid.show('Deleted successfully!', ToastAndroid.SHORT);
			router.back();
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	}

	return {
		loading,
		createBudgetRecord,
		budgetCategory,
		budgetCreatedAt,
		budgetLimit,
		budgetPeriod,
		currentBudgetSpending,
		setBudgetCategory,
		setBudgetCreatedAt,
		setBudgetLimit,
		setBudgetSpending,
		setBudgetPeriod,
		deleteBudgetRecord,
		updateBudgetRecord,
	};
}

