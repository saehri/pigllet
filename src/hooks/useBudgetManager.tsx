import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

import * as schema from '@/db/schema';
import { SetStateAction, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { desc, eq, inArray } from 'drizzle-orm';

import { useRouter } from 'expo-router';
import moment from 'moment';

type Props = {
	actionType?: 'create' | 'read' | 'update' | 'delete';
	budgetId?: number;
};

export const loadBudgetRecord = () => {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	return drizzleDb
		.select({
			budget: {
				id: schema.budgets.id,
				category_id: schema.budgets.category_id,
				created_at: schema.budgets.created_at,
				max_spending: schema.budgets.max_spending,
				note: schema.budgets.note,
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
		.innerJoin(
			schema.categories,
			eq(schema.budgets.category_id, schema.categories.id)
		)
		.orderBy(desc(schema.budgets.created_at));
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
	setBudgetCategory: React.Dispatch<
		React.SetStateAction<schema.Category | undefined>
	>;
	budgetPeriod: Date;
	setBudgetPeriod: React.Dispatch<SetStateAction<Date>>;
	budgetMaxSpending: string;
	setBudgetMaxSpending: React.Dispatch<React.SetStateAction<string>>;
	currentBudgetSpending: string;
	setBudgetSpending: React.Dispatch<React.SetStateAction<string>>;
	budgetNote: string;
	setBudgetNote: React.Dispatch<React.SetStateAction<string>>;
	budgetCreatedAt: Date;
	setBudgetCreatedAt: React.Dispatch<React.SetStateAction<Date>>;
	transactionCategories: schema.Category[];
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
	const [budgetMaxSpending, setBudgetMaxSpending] = useState<string>('');
	const [currentBudgetSpending, setBudgetSpending] = useState<string>('');
	const [budgetNote, setBudgetNote] = useState<string>('');
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
							max_spending: schema.budgets.max_spending,
							note: schema.budgets.note,
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
						const { category, max_spending, note } = budget[0];

						setBudgetCategory(category as schema.Category);
						setBudgetMaxSpending(max_spending.toString());
						setBudgetNote(note || '');
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
				max_spending: Number(budgetMaxSpending),
				period: moment(new Date()).format('YYYY-MM-DD'),
				note: budgetNote,
			};

			await drizzleDb
				.insert(schema.budgets)
				.values(payload)
				.onConflictDoNothing();

			setBudgetMaxSpending('');
			setBudgetNote('');

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
					max_spending: Number(budgetMaxSpending),
					note: budgetNote,
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
		budgetMaxSpending,
		budgetNote,
		budgetPeriod,
		currentBudgetSpending,
		setBudgetCategory,
		setBudgetCreatedAt,
		setBudgetMaxSpending,
		setBudgetNote,
		setBudgetSpending,
		transactionCategories,
		setBudgetPeriod,
		deleteBudgetRecord,
		updateBudgetRecord,
	};
}

