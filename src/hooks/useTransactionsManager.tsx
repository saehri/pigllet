import { drizzle } from 'drizzle-orm/expo-sqlite';
import { ToastAndroid } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import moment from 'moment';

import * as schema from '@/db/schema';
import { alias } from 'drizzle-orm/sqlite-core';
import { and, desc, eq, sql } from 'drizzle-orm';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

type Props = {
	actionType?: 'create' | 'read' | 'update' | 'delete';
	transactionId?: number;
	transactionType?: schema.TransactionType;
};

type UseExpenseManagerTypes = {
	createExpenseRecord: () => Promise<void>;
	createIncomeRecord: () => Promise<void>;
	createTransferRecord: () => Promise<void>;
	updateExpenseRecord: () => Promise<void>;
	updateIncomeRecord: () => Promise<void>;
	updateTransferRecord: () => Promise<void>;
	deleteTransaction: () => Promise<void>;
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
	transactionAmount: string;
	setTransactionAmount: Dispatch<SetStateAction<string>>;
	transactionImage: string;
	setTransactionImage: Dispatch<SetStateAction<string>>;
};

export const loadTransactionsData = (
	date?: Date,
	range?: 'month' | 'year',
	transactionType?: 'income' | 'expense' | 'transfer'
): any => {
	const relatedAccountsAlias = alias(schema.accounts, 'related_accounts'); // Alias for related accounts
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	let startOfMonth = moment(date)
		.startOf(range || 'month')
		.format('YYYY-MM-DD');
	let endOfMonth = moment(date)
		.endOf(range || 'month')
		.format('YYYY-MM-DD');

	const whereConditions = [];

	if (date) {
		whereConditions.push(
			sql`DATE(${schema.transactions.created_at}) BETWEEN DATE(${startOfMonth}) AND DATE(${endOfMonth})`
		);
	}

	if (transactionType) {
		whereConditions.push(eq(schema.transactions.type, transactionType));
	}

	return drizzleDb
		.select({
			transaction: {
				id: schema.transactions.id,
				amount: schema.transactions.amount,
				note: schema.transactions.note,
				account_id: schema.transactions.account_id,
				related_account_id: schema.transactions.related_account_id,
				category_id: schema.transactions.category_id,
				type: schema.transactions.type,
				image: schema.transactions.image,
				created_at: schema.transactions.created_at,
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
			category: {
				id: schema.categories.id,
				label: schema.categories.label,
				icon_name: schema.categories.icon_name,
				type: schema.categories.type,
			},
			related_account: {
				id: relatedAccountsAlias.id,
				name: relatedAccountsAlias.name,
				number: relatedAccountsAlias.number,
				balance: relatedAccountsAlias.balance,
				is_cash: relatedAccountsAlias.is_cash,
				image: relatedAccountsAlias.image,
				created_at: relatedAccountsAlias.created_at,
			},
		})
		.from(schema.transactions)
		.where(and(...whereConditions))
		.innerJoin(
			schema.categories,
			eq(schema.transactions.category_id, schema.categories.id)
		)
		.innerJoin(
			schema.accounts,
			eq(schema.transactions.account_id, schema.accounts.id)
		)
		.leftJoin(
			relatedAccountsAlias,
			eq(schema.transactions.related_account_id, relatedAccountsAlias.id)
		)
		.orderBy(desc(schema.transactions.created_at));
};

export const deleteTransactions = async (db: any, transactionId: number) => {
	const relatedAccountsAlias = alias(schema.accounts, 'related_accounts');
	const drizzleDb = drizzle(db, { schema });

	try {
		// Fetch the transaction with its related accounts
		const transactionData = await drizzleDb
			.select({
				transaction: schema.transactions,
				account: schema.accounts,
				related_account: relatedAccountsAlias,
			})
			.from(schema.transactions)
			.where(eq(schema.transactions.id, transactionId))
			.innerJoin(
				schema.accounts,
				eq(schema.transactions.account_id, schema.accounts.id)
			)
			.leftJoin(
				relatedAccountsAlias,
				eq(schema.transactions.related_account_id, relatedAccountsAlias.id)
			);

		if (!transactionData.length) {
			throw new Error('Transaction not found');
		}

		const data = transactionData[0];
		const {
			transaction,
			account: mainAccount,
			related_account: relatedAccount,
		} = data;

		// Delete the transaction itself
		await drizzleDb
			.delete(schema.transactions)
			.where(eq(schema.transactions.id, transactionId));

		// Prepare balance update queries
		const updates: Promise<any>[] = [];

		if (
			transaction.type === 'transfer' &&
			relatedAccount &&
			mainAccount.id !== relatedAccount.id
		) {
			updates.push(
				drizzleDb
					.update(schema.accounts)
					.set({
						balance: mainAccount.balance + transaction.amount,
					})
					.where(eq(schema.accounts.id, mainAccount.id)),

				drizzleDb
					.update(schema.accounts)
					.set({
						balance: relatedAccount.balance - transaction.amount,
					})
					.where(eq(schema.accounts.id, relatedAccount.id))
			);
		} else if (transaction.type === 'income') {
			updates.push(
				drizzleDb
					.update(schema.accounts)
					.set({
						balance: mainAccount.balance - transaction.amount,
					})
					.where(eq(schema.accounts.id, mainAccount.id))
			);
		} else if (transaction.type === 'expense') {
			updates.push(
				drizzleDb
					.update(schema.accounts)
					.set({
						balance: mainAccount.balance + transaction.amount,
					})
					.where(eq(schema.accounts.id, mainAccount.id))
			);
		}

		await Promise.all(updates);

		// Update the budget associated with the transaction's category
		const budgets = await drizzleDb
			.select()
			.from(schema.budgets)
			.where(eq(schema.budgets.category_id, Number(transaction.category_id)));

		if (budgets.length) {
			const budget = budgets[0];

			await drizzleDb
				.update(schema.budgets)
				.set({
					current_spending:
						budget.current_spending - Number(transaction.amount),
				})
				.where(eq(schema.budgets.category_id, Number(transaction.category_id)));

			ToastAndroid.show('Budget updated!', ToastAndroid.CENTER);
		}

		ToastAndroid.show('Transaction deleted!', ToastAndroid.CENTER);
	} catch (error: any) {
		ToastAndroid.show(error.message, ToastAndroid.SHORT);
	}
};

export default function useTransactionsManager({
	actionType = 'read',
	transactionId,
	transactionType,
}: Props): UseExpenseManagerTypes {
	const router = useRouter();
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const relatedAccountsAlias = alias(schema.accounts, 'related_accounts'); // Alias for related accounts

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
	const [previouslyUsedRelatedAccount, setPreviouslyUsedRelatedAccount] =
		useState<schema.Account>();
	// ---- intialFormValue, previouslyUsedAccount, and previouslyUsedRelatedAccount is to store the old data
	// previouslyUsedAccount is the old data of the main account
	// previouslyUsedRelatedAccount is the old data of the related account

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
	const [transactionAmount, setTransactionAmount] = useState<string>('');
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
							related_account: relatedAccountsAlias,
						})
						.from(schema.transactions)
						.where(eq(schema.transactions.id, transactionId as number))
						.innerJoin(
							schema.categories,
							eq(schema.transactions.category_id, schema.categories.id)
						)
						.innerJoin(
							schema.accounts,
							eq(schema.transactions.account_id, schema.accounts.id)
						)
						.leftJoin(
							relatedAccountsAlias, // Use the alias for the second join
							eq(
								schema.transactions.related_account_id,
								relatedAccountsAlias.id
							)
						);

					const { accounts, categories, transactions, related_account } =
						data[0];

					setInitialFormValue(transactions);
					setPreviouslyUsedAccount(accounts);

					if (related_account) {
						setPreviouslyUsedRelatedAccount(related_account);
						setTransactionUsedRelatedAccount(related_account);
					}

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
					.where(eq(schema.categories.type, transactionType as string));

				setUserAccounts(userAccounts);
				setTransactionCategories(transactionCategories);

				if (
					transactionType == 'income' ||
					transactionType === 'expense' ||
					(transactionType === 'transfer' && actionType !== 'update')
				) {
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
		if (actionType !== 'read' && actionType !== 'delete') {
			populateForm();
		}
	}, []);

	// ----- CREATE
	async function createExpenseRecord() {
		try {
			setLoading(true);

			if (!transactionUsedAccount || !transactionCategory) return;

			if (!transactionAmount.length || isNaN(Number(transactionAmount))) {
				ToastAndroid.show('Please enter a valid amount', ToastAndroid.SHORT);
				return;
			}

			// ---- Idk what happend but if I don't do this and instead insert it directly to the query, it throwing types error.
			const payload: schema.Transaction = {
				account_id: Number(transactionUsedAccount.id),
				amount: Number(transactionAmount),
				category_id: Number(transactionCategory.id),
				created_at: moment(transactionCreatedAt).format('YYYY-MM-DD'),
				type: transactionType as string,
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
					balance: transactionUsedAccount.balance - Number(transactionAmount),
				})
				.where(eq(schema.accounts.id, transactionUsedAccount.id as number));

			const budgets = await drizzleDb
				.select()
				.from(schema.budgets)
				.where(eq(schema.budgets.category_id, Number(transactionCategory.id)));

			if (budgets.length) {
				const budgetOldState = budgets[0];

				await drizzleDb
					.update(schema.budgets)
					.set({
						current_spending:
							budgetOldState.current_spending + Number(transactionAmount),
					})
					.where(
						eq(schema.budgets.category_id, Number(transactionCategory.id))
					);
				ToastAndroid.show('Budget updated!', ToastAndroid.CENTER);
			}

			ToastAndroid.show('Expense added!', ToastAndroid.CENTER);

			// setTransactionAmount('');
			// setTransactionNote('');
			// setTransactionImage('');
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

			if (!transactionAmount.length || isNaN(Number(transactionAmount))) {
				ToastAndroid.show('Invalid transaction amount', ToastAndroid.SHORT);
				return;
			}

			const payload: schema.Transaction = {
				amount: Number(transactionAmount),
				account_id: transactionUsedAccount.id as number,
				category_id: transactionCategory.id as number,
				created_at: moment(transactionCreatedAt).format('YYYY-MM-DD'),
				image: transactionImage,
				note: transactionNote,
				type: transactionType as string,
			};

			await drizzleDb.insert(schema.transactions).values(payload);

			// also update the selected account balance
			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: transactionUsedAccount.balance + Number(transactionAmount),
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
				type: transactionType as string,
				amount: Number(transactionAmount),
				account_id: transactionUsedAccount.id as number,
				related_account_id: transactionUsedRelatedAccount.id,
				category_id: transactionCategory.id as number,
				created_at: moment(transactionCreatedAt).format('YYYY-MM-DD'),
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

			if (!transactionAmount.length || isNaN(Number(transactionAmount))) {
				ToastAndroid.show('Invalid transaction amount', ToastAndroid.SHORT);
				return;
			}

			await drizzleDb
				.update(schema.transactions)
				.set({
					type: transactionType,
					account_id: transactionUsedAccount?.id,
					amount: Number(transactionAmount),
					category_id: transactionCategory?.id,
					created_at: moment(transactionCreatedAt).format('YYYY-MM-DD'),
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
				initialFormValue.amount.toString() !== transactionAmount
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
						balance: transactionUsedAccount.balance - Number(transactionAmount),
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
			} else if (initialFormValue.amount.toString() !== transactionAmount) {
				// Only amount changed
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							previouslyUsedAccount.balance +
							initialFormValue.amount -
							Number(transactionAmount),
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));
			}

			if (initialFormValue.category_id !== transactionCategory?.id) {
				const oldBudget = await drizzleDb
					.select()
					.from(schema.budgets)
					.where(
						eq(schema.budgets.category_id, Number(initialFormValue.category_id))
					);

				if (oldBudget.length) {
					const budgetOldState = oldBudget[0];

					await drizzleDb
						.update(schema.budgets)
						.set({
							current_spending:
								budgetOldState.current_spending -
								Number(initialFormValue?.amount),
						})
						.where(
							eq(
								schema.budgets.category_id,
								Number(initialFormValue.category_id)
							)
						);
				}

				const newBudget = await drizzleDb
					.select()
					.from(schema.budgets)
					.where(
						eq(schema.budgets.category_id, Number(transactionCategory?.id))
					);

				if (newBudget.length) {
					await drizzleDb
						.update(schema.budgets)
						.set({
							current_spending:
								newBudget[0].current_spending + Number(transactionAmount),
						})
						.where(
							eq(schema.budgets.category_id, Number(transactionCategory?.id))
						);
				}

				ToastAndroid.show('Budget updated!', ToastAndroid.CENTER);
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

			if (!transactionAmount.length || isNaN(Number(transactionAmount))) {
				ToastAndroid.show('Invalid transaction amount', ToastAndroid.SHORT);
				return;
			}

			await drizzleDb
				.update(schema.transactions)
				.set({
					type: transactionType,
					account_id: transactionUsedAccount?.id,
					amount: Number(transactionAmount),
					category_id: transactionCategory?.id,
					created_at: moment(transactionCreatedAt).format('YYYY-MM-DD'),
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
				initialFormValue.amount.toString() !== transactionAmount
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
						balance: transactionUsedAccount.balance + Number(transactionAmount),
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
			else if (initialFormValue.amount.toString() !== transactionAmount) {
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							previouslyUsedAccount.balance -
							initialFormValue.amount +
							Number(transactionAmount),
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

	async function updateTransferRecord() {
		try {
			setLoading(true);

			if (
				!previouslyUsedAccount ||
				!previouslyUsedRelatedAccount ||
				!transactionUsedAccount ||
				!transactionUsedRelatedAccount ||
				!transactionCategory ||
				!transactionAmount.length ||
				!initialFormValue ||
				isNaN(Number(transactionAmount))
			) {
				ToastAndroid.show('Invalid transfer details', ToastAndroid.SHORT);
				return;
			}

			await drizzleDb
				.update(schema.transactions)
				.set({
					type: transactionType,
					amount: Number(transactionAmount),
					account_id: transactionUsedAccount.id as number,
					related_account_id: transactionUsedRelatedAccount.id,
					category_id: transactionCategory.id as number,
					created_at: moment(transactionCreatedAt).format('YYYY-MM-DD'),
					image: transactionImage,
					note: transactionNote,
				})
				.where(eq(schema.transactions.id, Number(transactionId)));

			if (initialFormValue.amount.toString() !== transactionAmount) {
				// 01 - change the main account balance
				// formula -> current balance + previous transactions amount - current transaction amount
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							previouslyUsedAccount.balance +
							initialFormValue.amount -
							Number(transactionAmount),
					})
					.where(eq(schema.accounts.id, previouslyUsedAccount.id as number));

				// 02 - change the related account balance
				// formula -> current balance - previous transactions amount + current transactions amount
				await drizzleDb
					.update(schema.accounts)
					.set({
						balance:
							previouslyUsedRelatedAccount.balance -
							initialFormValue.amount +
							Number(transactionAmount),
					})
					.where(
						eq(schema.accounts.id, previouslyUsedRelatedAccount?.id as number)
					);
			}

			ToastAndroid.show('Changes saved!', ToastAndroid.CENTER);
		} catch (error: any) {
			ToastAndroid.show(
				error.message || 'Error during transfer',
				ToastAndroid.CENTER
			);
		} finally {
			setLoading(false);
		}
	}

	async function deleteTransaction() {
		try {
			setLoading(true);

			// ---- Delete the transaction from the record
			const transactionData = await drizzleDb
				.select({
					transaction: schema.transactions,
					account: schema.accounts,
					related_account: relatedAccountsAlias,
				})
				.from(schema.transactions)
				.where(eq(schema.transactions.id, Number(transactionId)))
				.innerJoin(
					schema.accounts,
					eq(schema.transactions.account_id, schema.accounts.id)
				)
				.leftJoin(
					relatedAccountsAlias, // Use the alias for the second join
					eq(schema.transactions.related_account_id, relatedAccountsAlias.id)
				);

			const {
				transaction,
				account: mainAccount,
				related_account: relatedAccount,
			} = transactionData[0];

			await drizzleDb
				.delete(schema.transactions)
				.where(eq(schema.transactions.id, Number(transactionId)));

			if (transactionType === 'transfer' && relatedAccount) {
				if (mainAccount.id !== relatedAccount.id) {
					// 01 - change main account balance
					// formula -> main account balance + transaction amount
					await drizzleDb
						.update(schema.accounts)
						.set({
							balance: mainAccount.balance + transaction.amount,
						})
						.where(eq(schema.accounts.id, mainAccount.id as number));

					// 02 - change related account balance
					// formula -> related account balance - transaction amount
					await drizzleDb
						.update(schema.accounts)
						.set({
							balance: relatedAccount.balance - transaction.amount,
						})
						.where(eq(schema.accounts.id, relatedAccount.id as number));
				}
			} else {
				// --- Update the main account balance
				if (transactionType === 'income') {
					await drizzleDb
						.update(schema.accounts)
						.set({ balance: mainAccount.balance - transaction.amount })
						.where(eq(schema.accounts.id, mainAccount.id));
				} else if (transactionType === 'expense') {
					await drizzleDb
						.update(schema.accounts)
						.set({ balance: mainAccount.balance + transaction.amount })
						.where(eq(schema.accounts.id, mainAccount.id));
				}
			}

			const budgets = await drizzleDb
				.select()
				.from(schema.budgets)
				.where(eq(schema.budgets.category_id, Number(transaction.category_id)));

			if (budgets.length) {
				const budgetOldState = budgets[0];

				await drizzleDb
					.update(schema.budgets)
					.set({
						current_spending:
							budgetOldState.current_spending - Number(transaction?.amount),
					})
					.where(
						eq(schema.budgets.category_id, Number(transaction.category_id))
					);

				ToastAndroid.show('Budget updated!', ToastAndroid.CENTER);
			}

			ToastAndroid.show('Transaction deleted!', ToastAndroid.CENTER);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
			router.back();
		}
	}

	return {
		transactionUsedAccount,
		transactionCategories,
		createTransferRecord,
		transactionCreatedAt,
		createExpenseRecord,
		transactionCategory,
		transactionAmount,
		transactionImage,
		transactionNote,
		userAccounts,
		loading,
		setLoading,
		deleteTransaction,
		setTransactionNote,
		createIncomeRecord,
		updateIncomeRecord,
		setTransactionImage,
		updateExpenseRecord,
		setTransactionAmount,
		updateTransferRecord,
		setTransactionCategory,
		setTransactionCreatedAt,
		setTransactionUsedAccount,
		transactionUsedRelatedAccount,
		setTransactionUsedRelatedAccount,
	};
}

