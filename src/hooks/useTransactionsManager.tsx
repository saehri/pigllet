import { drizzle } from 'drizzle-orm/expo-sqlite';
import { ToastAndroid } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import * as schema from '@/db/schema';
import { alias } from 'drizzle-orm/sqlite-core';
import { and, desc, eq, sql } from 'drizzle-orm';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props = {
	actionType?: 'create' | 'read' | 'update';
	transactionId?: number;
	transactionType: 'expense' | 'income' | 'transfer';
};

type UseExpenseManagerTypes = {
	loadExpenseData: (startDate: string, endDate: string) => any;
	loadIncomeData: (startDate: string, endDate: string) => any;
	loadTransferData: (startDate: string, endDate: string) => any;
	createExpenseRecord: () => Promise<void>;
	createIncomeRecord: () => Promise<void>;
	createTransferRecord: () => Promise<void>;
	updateExpenseRecord: () => Promise<void>;
	updateIncomeRecord: () => Promise<void>;
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
	userAccounts: schema.Account[];
	transactionCategories: schema.Category[];
	transactionCreatedAt: Date;
	setTransactionCreatedAt: Dispatch<SetStateAction<Date>>;
	transactionCategory: schema.Category | undefined;
	setTransactionCategory: Dispatch<SetStateAction<schema.Category | undefined>>;
	transactionUsedAccount: schema.Account | undefined;
	setTransactionUsedAccount: Dispatch<
		SetStateAction<schema.Account | undefined>
	>;
	transactionUsedRelatedAccount: schema.Account | undefined;
	setTransactionUsedRelatedAccount: Dispatch<
		SetStateAction<schema.Account | undefined>
	>;
	transactionNote: string;
	setTransactionNote: Dispatch<SetStateAction<string>>;
	transactionAmmount: string;
	setTransactionAmount: Dispatch<SetStateAction<string>>;
	transactionImage: string;
	setTransactionImage: Dispatch<SetStateAction<string>>;
};

export default function useTransactionsManager({
	actionType = 'read',
	transactionId,
	transactionType,
}: Props): UseExpenseManagerTypes {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	// ------ form state
	const [loading, setLoading] = useState<boolean>(false);

	// userAccounts and transactionCategories will be populated by the populateForm fn
	// userAccounts list all the accounts the user owned
	// transactionCategories list all transaction categories available
	const [userAccounts, setUserAccounts] = useState<schema.Account[]>([]);
	const [transactionCategories, setTransactionCategories] = useState<
		schema.Category[]
	>([]);

	// ------ form input state
	const [initialFormValue, setInitialFormValue] =
		useState<schema.Transaction>();
	const [previouslyUsedAccount, setPreviouslyUsedAccount] =
		useState<schema.Account>();
	// ---- intialFormValue and previouslyUsedAccount is to store the old data
	// previouslyUsedAccount is the old data of the main account

	const [transactionCreatedAt, setTransactionCreatedAt] = useState<Date>(
		new Date()
	);
	const [transactionCategory, setTransactionCategory] =
		useState<schema.Category>();
	const [transactionUsedAccount, setTransactionUsedAccount] =
		useState<schema.Account>(); // store the main account
	const [transactionUsedRelatedAccount, setTransactionUsedRelatedAccount] =
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
				const transactionCategories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, transactionType));

				setUserAccounts(userAccounts);
				setTransactionCategories(transactionCategories);
				if (userAccounts.length > 1) {
					setTransactionUsedRelatedAccount(userAccounts[1]);
				} else {
					setTransactionUsedRelatedAccount(userAccounts[0]);
				}

				// ----- Populate the transaction category and transa. used account with default data
				if (actionType !== 'update' && !transactionId) {
					setTransactionCategory(transactionCategories[0]);
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
					eq(schema.transactions.type, transactionType),
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

	const loadIncomeData = (startDate: string, endDate: string) =>
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
				category: {
					id: schema.categories.id,
					label: schema.categories.label,
					icon_name: schema.categories.icon_name,
					type: schema.categories.type,
				},
				account: {
					id: schema.accounts.id,
					name: schema.accounts.name,
					number: schema.accounts.number,
					balance: schema.accounts.balance,
					is_cash: schema.accounts.is_cash,
					image: schema.accounts.image,
					created_at: schema.accounts.created_at,
				},
			})
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.type, transactionType),
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

	const loadTransferData = (startDate: string, endDate: string) => {
		const relatedAccounts = alias(schema.accounts, 'related_accounts'); // Alias for related accounts

		return drizzleDb
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
				account: schema.accounts,
				related_account: relatedAccounts, // Use the alias here
			})
			.from(schema.transactions)
			.where(
				and(
					eq(schema.transactions.type, transactionType),
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
			.innerJoin(
				relatedAccounts, // Use the alias for the second join
				eq(schema.transactions.related_account_id, relatedAccounts.id)
			)
			.orderBy(desc(schema.transactions.created_at));
	};
	// ----- CREATE
	async function createExpenseRecord() {
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

	async function createIncomeRecord() {
		try {
			setLoading(true);

			if (!transactionUsedAccount || !transactionCategory) return;

			if (!transactionAmmount.length || isNaN(Number(transactionAmmount))) {
				ToastAndroid.show('Invalid transaction ammount', ToastAndroid.SHORT);
				return;
			}

			const payload: schema.Transaction = {
				amount: Number(transactionAmmount),
				account_id: transactionUsedAccount.id as number,
				category_id: transactionCategory.id as number,
				created_at: transactionCreatedAt.toISOString(),
				image: transactionImage,
				note: transactionNote,
				type: transactionType,
			};

			await drizzleDb.insert(schema.transactions).values(payload);

			// also update the selected account balance
			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: transactionUsedAccount.balance + Number(transactionAmmount),
				})
				.where(eq(schema.accounts.id, transactionUsedAccount.id as number));

			ToastAndroid.show('Income record added!', ToastAndroid.CENTER);

			setTransactionAmount('');
			setTransactionNote('');
			setTransactionImage('');
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	async function createTransferRecord() {
		try {
			setLoading(true);
			if (
				!transactionUsedAccount ||
				!transactionUsedRelatedAccount ||
				!transactionCategory
			)
				return;

			// moved the payload into its own variable because the little shit keep screaming the types is invalid
			const payload: schema.Transaction = {
				type: transactionType,
				amount: Number(transactionAmmount),
				account_id: transactionUsedAccount.id as number,
				related_account_id: transactionUsedRelatedAccount.id,
				category_id: transactionCategory.id as number,
				created_at: transactionCreatedAt.toISOString(),
				image: transactionImage,
				note: transactionNote,
			};

			await drizzleDb
				.insert(schema.transactions)
				.values(payload)
				.onConflictDoNothing();

			// Update the account balance of main account and related account
			// if the user pick two different account
			if (transactionUsedAccount.id !== transactionUsedRelatedAccount.id) {
				// update the main account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: transactionUsedAccount.balance - payload.amount,
					})
					.where(eq(schema.accounts.id, transactionUsedAccount.id as number));

				// update the related account balance
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: transactionUsedRelatedAccount.balance + payload.amount,
					})
					.where(
						eq(schema.accounts.id, transactionUsedRelatedAccount.id as number)
					);
			}

			ToastAndroid.show('Trasfer record added!', ToastAndroid.CENTER);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	// ----- UPDATE
	async function updateExpenseRecord() {
		try {
			setLoading(true);

			if (!transactionAmmount.length || isNaN(Number(transactionAmmount))) {
				ToastAndroid.show('Invalid transaction amount', ToastAndroid.SHORT);
				return;
			}

			await drizzleDb
				.update(schema.transactions)
				.set({
					type: transactionType,
					account_id: transactionUsedAccount?.id,
					amount: Number(transactionAmmount),
					category_id: transactionCategory?.id,
					created_at: transactionCreatedAt.toISOString(),
					image: transactionImage,
					note: transactionNote,
				})
				.where(eq(schema.transactions.id, initialFormValue?.id as number));

			// ---- if the user change the account used but does not change the transaction amount -> then adjust the balance for each accounts used
			if (
				!previouslyUsedAccount ||
				!initialFormValue ||
				!transactionUsedAccount
			)
				return;
			if (
				initialFormValue.account_id !== transactionUsedAccount.id &&
				initialFormValue.amount.toString() !== transactionAmmount
			) {
				// Both account and amount changed
				// Undo old amount from old account
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: previouslyUsedAccount.balance + initialFormValue.amount,
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));
				// Apply new amount to new account
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							transactionUsedAccount.balance - Number(transactionAmmount),
					})
					.where(eq(schema.accounts.id, transactionUsedAccount.id as number));
			} else if (initialFormValue.account_id !== transactionUsedAccount.id) {
				// Only account changed
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: previouslyUsedAccount.balance + initialFormValue.amount,
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: transactionUsedAccount.balance - initialFormValue.amount,
					})
					.where(eq(schema.accounts.id, transactionUsedAccount.id as number));
			} else if (initialFormValue.amount.toString() !== transactionAmmount) {
				// Only amount changed
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

	async function updateIncomeRecord() {
		try {
			setLoading(true);

			if (!transactionAmmount.length || isNaN(Number(transactionAmmount))) {
				ToastAndroid.show('Invalid transaction amount', ToastAndroid.SHORT);
				return;
			}

			await drizzleDb
				.update(schema.transactions)
				.set({
					type: transactionType,
					account_id: transactionUsedAccount?.id,
					amount: Number(transactionAmmount),
					category_id: transactionCategory?.id,
					created_at: transactionCreatedAt.toISOString(),
					image: transactionImage,
					note: transactionNote,
				})
				.where(eq(schema.transactions.id, initialFormValue?.id as number));

			if (
				!previouslyUsedAccount ||
				!initialFormValue ||
				!transactionUsedAccount
			)
				return;

			// CASE 1: Both account and amount changed
			if (
				initialFormValue.account_id !== transactionUsedAccount.id &&
				initialFormValue.amount.toString() !== transactionAmmount
			) {
				// Subtract old income from old account
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: previouslyUsedAccount.balance - initialFormValue.amount,
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));

				// Add new income to new account
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							transactionUsedAccount.balance + Number(transactionAmmount),
					})
					.where(eq(schema.accounts.id, transactionUsedAccount.id as number));
			}
			// CASE 2: Only account changed
			else if (initialFormValue.account_id !== transactionUsedAccount.id) {
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: previouslyUsedAccount.balance - initialFormValue.amount,
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));

				await drizzleDb
					.update(schema.accounts)
					.set({
						balance: transactionUsedAccount.balance + initialFormValue.amount,
					})
					.where(eq(schema.accounts.id, transactionUsedAccount.id as number));
			}
			// CASE 3: Only amount changed
			else if (initialFormValue.amount.toString() !== transactionAmmount) {
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							previouslyUsedAccount.balance -
							initialFormValue.amount +
							Number(transactionAmmount),
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));
			}

			ToastAndroid.show('Changes saved!', ToastAndroid.CENTER);
		} catch (error) {
			ToastAndroid.show('Error when updating income', ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	}

	return {
		transactionUsedAccount,
		transactionCategories,
		createTransferRecord,
		transactionCreatedAt,
		createExpenseRecord,
		transactionCategory,
		transactionAmmount,
		loadTransferData,
		transactionImage,
		loadExpenseData,
		transactionNote,
		loadIncomeData,
		userAccounts,
		loading,
		setLoading,
		setTransactionNote,
		createIncomeRecord,
		updateIncomeRecord,
		setTransactionImage,
		updateExpenseRecord,
		setTransactionAmount,
		setTransactionCategory,
		setTransactionCreatedAt,
		setTransactionUsedAccount,
		transactionUsedRelatedAccount,
		setTransactionUsedRelatedAccount,
	};
}

