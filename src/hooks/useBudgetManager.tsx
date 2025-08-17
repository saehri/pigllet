import { ToastAndroid } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { SetStateAction, useEffect, useState } from 'react';

import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { asc, eq, inArray, sql } from 'drizzle-orm';

import { useRouter } from 'expo-router';
import moment from 'moment';

type Props = {
	actionType?: 'create' | 'read' | 'update' | 'delete';
	budgetId?: number;
};

export const loadBudgetRecord = (selectedDate: Date) => {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

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

export const deleteBudgetRecord = async (budgetIds: number[], db: any) => {
	const drizzleDb = drizzle(db, { schema });

	return drizzleDb
		.delete(schema.budgets)
		.where(inArray(schema.budgets.id, budgetIds));
};

type UseBudgetManagerTypes = {
	loading: boolean;
	createBudgetRecord: () => Promise<void>;
	updateBudgetRecord: () => Promise<void>;
	deleteBudgetRecord: () => Promise<void>;
	budgetCategory: schema.Category | undefined;
	budgetPeriod: Date;
	budgetCreatedAt: Date;
	budgetLimit: string;
	currentBudgetSpending: string;
	transactionCategories: schema.Category[];
	setBudgetCategory: React.Dispatch<
		React.SetStateAction<schema.Category | undefined>
	>;
	setBudgetLimit: React.Dispatch<React.SetStateAction<string>>;
	setBudgetSpending: React.Dispatch<React.SetStateAction<string>>;
	setBudgetCreatedAt: React.Dispatch<React.SetStateAction<Date>>;
	setBudgetPeriod: React.Dispatch<SetStateAction<Date>>;
};

export default function useBudgetManager({
	actionType,
	budgetId,
}: Props): UseBudgetManagerTypes {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const router = useRouter();

	// ---- form state
	const [loading, setLoading] = useState<boolean>(false);
	const [transactionCategories, setTransactionCategories] = useState<
		schema.Category[]
	>([]);

	// ---- form input states
	const [budgetCategory, setBudgetCategory] = useState<schema.Category>();
	const [budgetPeriod, setBudgetPeriod] = useState(new Date());
	const [budgetLimit, setBudgetLimit] = useState<string>('');
	const [currentBudgetSpending, setBudgetSpending] = useState<string>('');
	const [budgetCreatedAt, setBudgetCreatedAt] = useState<Date>(new Date());

	useEffect(() => {
		async function populateForm() {
			try {
				if (actionType === 'update') {
					const budget = await drizzleDb
						.select({
							id: schema.budgets.id,
							category_id: schema.budgets.category_id,
							created_at: schema.budgets.created_at,
							limit: schema.budgets.limit,
							period: schema.budgets.period,
							category: {
								id: schema.categories.id,
								icon_name: schema.categories.icon_name,
								label: schema.categories.label,
							},
						})
						.from(schema.budgets)
						.where(eq(schema.budgets.id, Number(budgetId)))
						.leftJoin(
							schema.categories,
							eq(schema.budgets.category_id, schema.categories.id)
						);

					if (budget.length) {
						const { category, limit } = budget[0];

						setBudgetCategory(category as schema.Category);
						setBudgetLimit(limit.toString());
					}
				}

				const categories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, 'expense'));

				setTransactionCategories(categories);

				if (actionType === 'create') {
					setBudgetCategory(categories[0]);
				}
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			}
		}

		if (actionType !== 'read') {
			populateForm();
		}
	}, []);

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
	async function updateBudgetRecord() {
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
	async function deleteBudgetRecord() {
		try {
			setLoading(true);

			await drizzleDb
				.delete(schema.budgets)
				.where(eq(schema.budgets.id, Number(budgetId)));

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
		transactionCategories,
		setBudgetPeriod,
		deleteBudgetRecord,
		updateBudgetRecord,
	};
}

