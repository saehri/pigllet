import moment from 'moment';
import { useState } from 'react';
import { ToastAndroid } from 'react-native';

import * as schema from '@/db/schema';
import { useDrizzleDB } from './useDrizzleDb';
import { alias } from 'drizzle-orm/sqlite-core';
import { and, desc, eq, or, sql } from 'drizzle-orm';

interface loadTransactionsData {
	date?: moment.MomentInput;
	range?: 'month' | 'year';
	transactionType?: 'income' | 'expense' | 'transfer';
	accountId?: number;
	categoryId?: number;
}

export const loadTransactionsData = ({
	date,
	range,
	transactionType,
	accountId,
	categoryId,
}: loadTransactionsData) => {
	const relatedAccountsAlias = alias(schema.accounts, 'related_accounts'); // Alias for related accounts
	const drizzleDb = useDrizzleDB();

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

	if (accountId) {
		whereConditions.push(eq(schema.transactions.account_id, accountId));
	}

	if (categoryId) {
		whereConditions.push(
			or(
				eq(schema.transactions.category_id, categoryId),
				eq(schema.transactions.related_account_id, categoryId)
			)
		);
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
				card_name: schema.accounts.card_name,
				card_number: schema.accounts.card_number,
				balance: schema.accounts.balance,
				is_default: schema.accounts.is_default,
				card_color: schema.accounts.card_color,
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
				card_name: relatedAccountsAlias.card_name,
				card_number: relatedAccountsAlias.card_number,
				balance: relatedAccountsAlias.balance,
				is_default: relatedAccountsAlias.is_default,
				card_color: relatedAccountsAlias.card_color,
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

export const useRecordExpenseForm = () => {
	const drizzleDb = useDrizzleDB();

	const [loading, setLoading] = useState<boolean>(false);
	const [transactionAmount, setTransactionAmount] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<schema.Category>();
	const [transactionDate, setTransactionDate] = useState<moment.MomentInput>(
		new Date()
	);
	const [accountUsed, setAccountUsed] = useState<schema.Account>();
	const [note, setNote] = useState<string>('');
	const [image, setImage] = useState<string>('');

	const createExpenseRecord = async () => {
		try {
			setLoading(true);

			if (!accountUsed || !selectedCategory) return;

			await drizzleDb.transaction(async (tx) => {
				await tx.insert(schema.transactions).values({
					account_id: accountUsed.id! as number,
					amount: Number(transactionAmount),
					category_id: selectedCategory.id!,
					created_at: moment(transactionDate).format('YYYY-MM-DD'),
					type: 'expense',
					image,
					note,
				});

				await tx
					.update(schema.accounts)
					.set({ balance: accountUsed.balance - Number(transactionAmount) })
					.where(eq(schema.accounts.id, accountUsed?.id!));
			});

			ToastAndroid.show('Expense recorded!', ToastAndroid.SHORT);

			setTransactionAmount('');
			setNote('');
			setImage('');
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	};

	const updateExpenseRecord = async (transactionId: number) => {
		try {
			setLoading(true);

			if (!accountUsed || !selectedCategory) return;

			await drizzleDb.transaction(async (tx) => {
				const oldTransactionRecord = await tx
					.select()
					.from(schema.transactions)
					.where(
						and(
							eq(schema.transactions.id, transactionId),
							eq(schema.transactions.type, 'expense')
						)
					)
					.innerJoin(
						schema.accounts,
						eq(schema.accounts.id, schema.transactions.account_id)
					);

				const { accounts: oldAccount, transactions: oldTransaction } =
					oldTransactionRecord[0];

				const isAccountChanged = oldAccount.id !== accountUsed.id;

				if (isAccountChanged) {
					const newAccountBalance =
						accountUsed.balance - Number(transactionAmount);
					const oldAccountBalance = oldAccount.balance + oldTransaction.amount;

					await tx
						.update(schema.accounts)
						.set({ balance: newAccountBalance })
						.where(eq(schema.accounts.id, Number(accountUsed.id)));

					await tx
						.update(schema.accounts)
						.set({ balance: oldAccountBalance })
						.where(eq(schema.accounts.id, oldAccount.id));
				} else {
					const newBalance =
						oldAccount.balance +
						oldTransaction.amount -
						Number(transactionAmount);

					await tx
						.update(schema.accounts)
						.set({
							balance: newBalance,
						})
						.where(eq(schema.accounts.id, oldAccount.id));
				}

				await tx
					.update(schema.transactions)
					.set({
						amount: Number(transactionAmount),
						category_id: Number(selectedCategory.id),
						created_at: moment(transactionDate).format('YYYY-MM-DD'),
						account_id: accountUsed?.id,
						note,
						image,
					})
					.where(eq(schema.transactions.id, oldTransaction?.id!));
			});

			ToastAndroid.show('Changes saved!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		note,
		image,
		accountUsed,
		transactionDate,
		selectedCategory,
		transactionAmount,
		setTransactionAmount,
		setSelectedCategory,
		setTransactionDate,
		setAccountUsed,
		setImage,
		setNote,
		createExpenseRecord,
		updateExpenseRecord,
		drizzleDb,
	};
};

export const useRecordIncomeForm = () => {
	const drizzleDb = useDrizzleDB();

	const [loading, setLoading] = useState<boolean>(false);
	const [transactionAmount, setTransactionAmount] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<schema.Category>();
	const [transactionDate, setTransactionDate] = useState<moment.MomentInput>(
		new Date()
	);
	const [accountUsed, setAccountUsed] = useState<schema.Account>();
	const [note, setNote] = useState<string>('');
	const [image, setImage] = useState<string>('');

	const createIncomeRecord = async () => {
		try {
			setLoading(true);

			if (!accountUsed || !selectedCategory) return;

			await drizzleDb.transaction(async (tx) => {
				await tx.insert(schema.transactions).values({
					account_id: Number(accountUsed.id),
					amount: Number(transactionAmount),
					category_id: selectedCategory.id!,
					created_at: moment(transactionDate).format('YYYY-MM-DD'),
					type: 'income',
					image,
					note,
				});

				await tx
					.update(schema.accounts)
					.set({ balance: accountUsed.balance + Number(transactionAmount) })
					.where(eq(schema.accounts.id, accountUsed?.id!));
			});

			ToastAndroid.show('Income recorded!', ToastAndroid.SHORT);

			setTransactionAmount('');
			setNote('');
			setImage('');
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	};

	const updateIncomeRecord = async (transactionId: number) => {
		try {
			setLoading(true);

			if (!accountUsed || !selectedCategory) return;

			await drizzleDb.transaction(async (tx) => {
				const oldTransactionRecord = await tx
					.select()
					.from(schema.transactions)
					.where(
						and(
							eq(schema.transactions.id, transactionId),
							eq(schema.transactions.type, 'income')
						)
					)
					.innerJoin(
						schema.accounts,
						eq(schema.accounts.id, schema.transactions.account_id)
					);

				const { accounts: oldAccount, transactions: oldTransaction } =
					oldTransactionRecord[0];

				const isAccountChanged = oldAccount.id !== accountUsed.id;

				if (isAccountChanged) {
					const newAccountBalance =
						accountUsed.balance + Number(transactionAmount);
					const oldAccountBalance = oldAccount.balance - oldTransaction.amount;

					await tx
						.update(schema.accounts)
						.set({ balance: newAccountBalance })
						.where(eq(schema.accounts.id, Number(accountUsed.id)));

					await tx
						.update(schema.accounts)
						.set({ balance: oldAccountBalance })
						.where(eq(schema.accounts.id, oldAccount.id));
				} else {
					const newBalance =
						oldAccount.balance -
						oldTransaction.amount +
						Number(transactionAmount);

					await tx
						.update(schema.accounts)
						.set({
							balance: newBalance,
						})
						.where(eq(schema.accounts.id, oldAccount.id));
				}

				await tx
					.update(schema.transactions)
					.set({
						amount: Number(transactionAmount),
						category_id: Number(selectedCategory.id),
						created_at: moment(transactionDate).format('YYYY-MM-DD'),
						account_id: accountUsed?.id,
						note,
						image,
					})
					.where(eq(schema.transactions.id, oldTransaction?.id!));
			});

			ToastAndroid.show('Changes saved!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		note,
		image,
		accountUsed,
		transactionDate,
		selectedCategory,
		transactionAmount,
		setTransactionAmount,
		setSelectedCategory,
		setTransactionDate,
		setAccountUsed,
		setImage,
		setNote,
		createIncomeRecord,
		updateIncomeRecord,
		drizzleDb,
	};
};

export const useRecordTransferForm = () => {
	const drizzleDb = useDrizzleDB();
	const relatedAccountsAlias = alias(schema.accounts, 'related_accounts'); // Alias for related accounts

	const [loading, setLoading] = useState<boolean>(false);
	const [transactionAmount, setTransactionAmount] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<schema.Category>();
	const [transactionDate, setTransactionDate] = useState<moment.MomentInput>(
		new Date()
	);
	const [accountUsed, setAccountUsed] = useState<schema.Account>();
	const [relatedAccount, setRelatedAccount] = useState<schema.Account>();
	const [note, setNote] = useState<string>('');
	const [image, setImage] = useState<string>('');

	const createTransferRecord = async () => {
		try {
			setLoading(true);

			if (!accountUsed || !selectedCategory || !relatedAccount) return;

			await drizzleDb.transaction(async (tx) => {
				await tx.insert(schema.transactions).values({
					account_id: Number(accountUsed.id),
					amount: Number(transactionAmount),
					category_id: selectedCategory.id!,
					created_at: moment(transactionDate).format('YYYY-MM-DD'),
					type: 'transfer',
					image,
					note,
					related_account_id: relatedAccount.id,
				});

				if (accountUsed.id !== relatedAccount.id) {
					// update the sending account balance
					await tx
						.update(schema.accounts)
						.set({ balance: accountUsed.balance - Number(transactionAmount) })
						.where(eq(schema.accounts.id, Number(accountUsed.id)));

					// update the destination account balance
					await tx
						.update(schema.accounts)
						.set({
							balance: relatedAccount.balance + Number(transactionAmount),
						})
						.where(eq(schema.accounts.id, Number(relatedAccount.id)));
				}
			});

			ToastAndroid.show('Transfer recorded!', ToastAndroid.SHORT);

			setTransactionAmount('');
			setNote('');
			setImage('');
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	};

	const updateTransferRecord = async (transactionId: number) => {
		try {
			setLoading(true);

			await drizzleDb.transaction(async (tx) => {
				const oldTransactionRecord = await tx
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
							card_name: schema.accounts.card_name,
							card_number: schema.accounts.card_number,
							balance: schema.accounts.balance,
							is_default: schema.accounts.is_default,
							card_color: schema.accounts.card_color,
							created_at: schema.accounts.created_at,
						},
						related_account: {
							id: relatedAccountsAlias.id,
							card_name: relatedAccountsAlias.card_name,
							card_number: relatedAccountsAlias.card_number,
							balance: relatedAccountsAlias.balance,
							is_default: relatedAccountsAlias.is_default,
							card_color: relatedAccountsAlias.card_color,
							created_at: relatedAccountsAlias.created_at,
						},
					})
					.from(schema.transactions)
					.where(
						and(
							eq(schema.transactions.id, transactionId),
							eq(schema.transactions.type, 'transfer')
						)
					)
					.innerJoin(
						schema.accounts,
						eq(schema.accounts.id, schema.transactions.account_id)
					)
					.innerJoin(
						relatedAccountsAlias,
						eq(schema.transactions.related_account_id, relatedAccountsAlias.id)
					);

				const {
					account: oldAccount,
					transaction: oldTransaction,
					related_account: oldRelatedAccount,
				} = oldTransactionRecord[0];

				const isTransactionAmountChanged =
					oldTransaction.amount !== Number(transactionAmount);

				if (isTransactionAmountChanged) {
					const newOldAccountBalance =
						oldAccount.balance +
						oldTransaction.amount -
						Number(transactionAmount);
					const newOldRelatedAccBalance =
						oldRelatedAccount.balance -
						oldTransaction.amount +
						Number(transactionAmount);

					await tx
						.update(schema.accounts)
						.set({ balance: newOldAccountBalance })
						.where(eq(schema.accounts.id, oldAccount.id));
					await tx
						.update(schema.accounts)
						.set({ balance: newOldRelatedAccBalance })
						.where(eq(schema.accounts.id, oldRelatedAccount.id));
				}

				await tx
					.update(schema.transactions)
					.set({
						amount: Number(transactionAmount),
						category_id: Number(selectedCategory?.id),
						created_at: moment(transactionDate).format('YYYY-MM-DD'),
						note,
						image,
					})
					.where(eq(schema.transactions.id, oldTransaction?.id!));
			});

			ToastAndroid.show('Changes saved!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		note,
		image,
		accountUsed,
		relatedAccount,
		transactionDate,
		selectedCategory,
		transactionAmount,
		setTransactionAmount,
		setSelectedCategory,
		setTransactionDate,
		setAccountUsed,
		setImage,
		setNote,
		setRelatedAccount,
		createTransferRecord,
		updateTransferRecord,
		drizzleDb,
	};
};

