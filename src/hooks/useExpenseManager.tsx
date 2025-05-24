import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';

import * as schema from '@/db/schema';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { and, desc, eq, sql } from 'drizzle-orm';

type Props = {
	actionType?: 'create' | 'read' | 'update';
	transactionId?: number;
};

type UseExpenseManagerTypes = {
	loadExpenseData: (startDate: string, endDate: string) => any;
	createTransactionRecord: () => Promise<void>;
	updateTransactionRecord: () => Promise<void>;
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
	userAccounts: schema.Account[];
	expenseCategories: schema.Category[];
	transactionCreatedAt: Date;
	setTransactionCreatedAt: Dispatch<SetStateAction<Date>>;
	transactionCategory: schema.Category | undefined;
	setTransactionCategory: Dispatch<SetStateAction<schema.Category | undefined>>;
	transactionUsedAccount: schema.Account | undefined;
	setTransactionUsedAccount: Dispatch<
		SetStateAction<schema.Account | undefined>
	>;
	transactionNote: string;
	setTransactionNote: Dispatch<SetStateAction<string>>;
	transactionAmmount: string;
	setTransactionAmount: Dispatch<SetStateAction<string>>;
	transactionImage: string;
	setTransactionImage: Dispatch<SetStateAction<string>>;
};

export default function useExpenseManager({
	actionType = 'read',
	transactionId,
}: Props): UseExpenseManagerTypes {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const transactionType = 'expense';

	// ------ form state
	const [loading, setLoading] = useState<boolean>(false);

	// userAccounts and userExpenseCategories will be populated by the populateForm fn
	const [userAccounts, setUserAccounts] = useState<schema.Account[]>([]);
	const [userExpenseCategories, setUserExpensesCategories] = useState<
		schema.Category[]
	>([]);

	// ------ form input state
	const [initialFormValue, setInitialFormValue] =
		useState<schema.Transaction>();
	const [previouslyUsedAccount, setPreviouslyUsedAccount] =
		useState<schema.Account>();

	const [transactionCreatedAt, setTransactionCreatedAt] = useState<Date>(
		new Date()
	);
	const [transactionCategory, setTransactionCategory] =
		useState<schema.Category>();
	const [transactionUsedAccount, setTransactionUsedAccount] =
		useState<schema.Account>();
	const [transactionNote, setTransactionNote] = useState<string>('');
	const [transactionAmmount, setTransactionAmount] = useState<string>('');
	const [transactionImage, setTransactionImage] = useState<string>('');

	// ----- set up the form
	useEffect(() => {
		async function populateForm() {
			try {
				// ----- Fetch the transaction data if the user is editing
				if (actionType === 'update' && transactionId) {
					const data = await drizzleDb
						.select({
							transactions: schema.transactions,
							accounts: schema.accounts,
							categories: schema.categories,
						})
						.from(schema.transactions)
						.where(eq(schema.transactions.id, Number(transactionId)))
						.innerJoin(
							schema.categories,
							eq(schema.transactions.category_id, schema.categories.id)
						)
						.innerJoin(
							schema.accounts,
							eq(schema.transactions.account_id, schema.accounts.id)
						);

					const { accounts, categories, transactions } = data[0];

					setInitialFormValue(transactions);
					setPreviouslyUsedAccount(accounts);

					setTransactionAmount(transactions.amount.toString());
					setTransactionCategory(categories);
					setTransactionUsedAccount(accounts);
					setTransactionCreatedAt(new Date(transactions.created_at));
					setTransactionNote(transactions.note || '');
					setTransactionImage(transactions.image || '');
				}

				const userAccounts = await drizzleDb.select().from(schema.accounts);
				const expenseCategories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, transactionType));

				setUserAccounts(userAccounts);
				setUserExpensesCategories(expenseCategories);

				// ----- Populate the transaction category and transa. used account with default data
				if (actionType !== 'update' && !transactionId) {
					setTransactionCategory(expenseCategories[0]);
					setTransactionUsedAccount(userAccounts[0]);
				}
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			}
		}

		// ----- Do nothing if the user use the hooks for reading the data
		if (actionType !== 'read') {
			populateForm();
		}
	}, []);

	// ----- READ
	const loadExpenseData = (startDate: string, endDate: string) =>
		drizzleDb
			.select({
				id: schema.transactions.id,
				amount: schema.transactions.amount,
				note: schema.transactions.note,
				account_id: schema.transactions.account_id,
				category_id: schema.transactions.category_id,
				type: schema.transactions.type,
				image: schema.transactions.image,
				created_at: schema.transactions.created_at,
				category: schema.categories,
				accountName: schema.accounts.name,
			})
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.type, 'expense'),
					sql`DATE(transactions.created_at) BETWEEN DATE(${startDate}) AND DATE(${endDate})`
				)
			)
			.innerJoin(
				schema.categories,
				eq(schema.transactions.category_id, schema.categories.id)
			)
			.innerJoin(
				schema.accounts,
				eq(schema.transactions.account_id, schema.accounts.id)
			)
			.orderBy(desc(schema.transactions.created_at));

	// ----- CREATE
	async function createTransactionRecord() {
		try {
			setLoading(true);

			if (!transactionUsedAccount || !transactionCategory) return;

			if (!transactionAmmount.length || isNaN(Number(transactionAmmount))) {
				ToastAndroid.show('Please enter a valid amount', ToastAndroid.SHORT);
				return;
			}

			// ---- Idk what happend but if I don't do this and instead insert it directly to the query, it throwing types error.
			const payload: schema.Transaction = {
				account_id: Number(transactionUsedAccount.id),
				amount: Number(transactionAmmount),
				category_id: Number(transactionCategory.id),
				created_at: transactionCreatedAt.toISOString(),
				type: transactionType,
				image: transactionImage,
				note: transactionNote,
			};

			// ---- Save the transaction record
			await drizzleDb
				.insert(schema.transactions)
				.values(payload)
				.onConflictDoNothing();

			// also update the selected account balance
			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: transactionUsedAccount.balance - Number(transactionAmmount),
				})
				.where(eq(schema.accounts.id, transactionUsedAccount.id as number));

			ToastAndroid.show('Expense added!', ToastAndroid.CENTER);

			setTransactionAmount('');
			setTransactionNote('');
			setTransactionImage('');
		} catch (error: any) {
			ToastAndroid.show('Error adding expense', ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	// ----- UPDATE
	async function updateTransactionRecord() {
		try {
			setLoading(true);

			if (!transactionAmmount.length || isNaN(Number(transactionAmmount))) {
				ToastAndroid.show('Invalid transaction amount', ToastAndroid.SHORT);
				return;
			}

			await drizzleDb
				.update(schema.transactions)
				.set({
					type: 'expense',
					account_id: transactionUsedAccount?.id,
					amount: Number(transactionAmmount),
					category_id: transactionCategory?.id,
					created_at: transactionCreatedAt.toISOString(),
					image: transactionImage,
					note: transactionImage,
				})
				.where(eq(schema.transactions.id, initialFormValue?.id as number));

			if (
				!previouslyUsedAccount ||
				!initialFormValue ||
				!transactionUsedAccount
			)
				return;
			// ---- if the user change the account and the transaction ammount
			if (
				initialFormValue.account_id !== transactionUsedAccount.id &&
				initialFormValue.amount.toString() !== transactionAmmount
			) {
				// --- increase the previous account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							previouslyUsedAccount.balance +
							initialFormValue.amount +
							Number(transactionAmmount),
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));

				// ---- reduce the new used account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							transactionUsedAccount.balance - Number(transactionAmmount),
					})
					.where(eq(schema.accounts.id, transactionUsedAccount.id as number));
			}

			// ---- if the user change the account used but does not change the transaction amount -> then adjust the balance for each accounts used
			if (initialFormValue.account_id !== transactionUsedAccount?.id) {
				// NOTE (for this scope only): PLEASE KEEP IN MIND WHEN CHANGING THE BALANCE TO USE THE INITIALFORMVALUE AS IT IS THE OLD VALUE OF THE TRANSACTION
				// --- increase the previous account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: previouslyUsedAccount.balance + initialFormValue.amount,
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));

				// ---- reduce the new used account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: transactionUsedAccount.balance - initialFormValue.amount,
					})
					.where(eq(schema.accounts.id, transactionUsedAccount.id as number));
			}

			// --- if the user only change the transaction ammount
			if (initialFormValue.amount.toString() !== transactionAmmount) {
				// --- increase the account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							previouslyUsedAccount.balance +
							initialFormValue.amount -
							Number(transactionAmmount),
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));
			}

			ToastAndroid.show('Changes saved!', ToastAndroid.CENTER);
		} catch (error) {
			ToastAndroid.show('Error when updating expense', ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	return {
		loadExpenseData,
		createTransactionRecord,
		loading,
		expenseCategories: userExpenseCategories,
		setLoading,
		setTransactionAmount,
		setTransactionCategory,
		setTransactionCreatedAt,
		setTransactionImage,
		setTransactionNote,
		setTransactionUsedAccount,
		transactionAmmount,
		transactionCategory,
		transactionCreatedAt,
		transactionImage,
		transactionNote,
		transactionUsedAccount,
		userAccounts,
		updateTransactionRecord,
	};
}

