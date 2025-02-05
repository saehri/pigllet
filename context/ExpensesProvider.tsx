import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transactionTypes } from '@/constants/transactions';

const STORAGE_KEY = 'EXPENSES';

export type ExpenseDataTypes = {
	id: number;
	description: string;
	total: number;
	paid_at: string;
	category?: string;
	transaction_type: transactionTypes;
	wallet: {
		wallet_id: number;
		wallet_name: string;
	};
};

/* -------------------- DUMMY */

export interface ExpenseContextTypes {
	loading: boolean;
	allExpenses: ExpenseDataTypes[];
	saveExpenses: (payload: ExpenseDataTypes) => void;
	deleteExpenseById: (_id: number) => void;
	getExpensesByDate: (date: Date) => ExpenseDataTypes[] | [];
	getExpensesByMonth: (date: Date) => ExpenseDataTypes[] | [];
	getExpenseById: (_id: number) => ExpenseDataTypes;
	updateExpenseData: (payload: ExpenseDataTypes, _id: number) => {};
	clearData: () => void;
	getCurrentBalance: () => number;
}

export const ExpenseContext = createContext<ExpenseContextTypes | undefined>(
	undefined
);

const ExpenseProvider = ({ children }: { children: ReactNode }) => {
	const [allExpenses, setallExpenses] = useState<ExpenseDataTypes[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		loadExpenses();
	}, []);

	const getCurrentBalance = () => {
		try {
			let balance = 0;
			allExpenses
				.filter((e) => e.transaction_type === 'income')
				.forEach((i) => {
					balance += i.total;
				});
			allExpenses
				.filter((e) => e.transaction_type === 'spending')
				.forEach((i) => {
					balance -= i.total;
				});

			return balance;
		} catch (error) {
			console.log(error);
			return 0;
		} finally {
			setLoading(false);
		}
	};

	const loadExpenses = async () => {
		try {
			const storedExpenses = await AsyncStorage.getItem(STORAGE_KEY);
			if (storedExpenses) {
				setallExpenses(JSON.parse(storedExpenses));
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const saveExpenses = async (payload: ExpenseDataTypes) => {
		try {
			setLoading(true);
			const newData = [payload, ...allExpenses];

			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
			setallExpenses((prevData) => [payload, ...prevData]);
			return { success: true };
		} catch (error) {
			return { success: false };
		} finally {
			setLoading(false);
		}
	};

	const getExpensesByDate = (date: Date) => {
		try {
			const expensesInCurrentDate = allExpenses.filter((expense) => {
				const expensePaidAt = new Date(expense.paid_at);

				const sameDate = expensePaidAt.getDate() === date.getDate();
				const sameMonth = expensePaidAt.getMonth() === date.getMonth();
				const sameYear = expensePaidAt.getFullYear() === date.getFullYear();

				if (sameDate && sameMonth && sameYear) return expense;
			});

			return expensesInCurrentDate;
		} catch (error) {
			console.log('Failed to retrieve your data!');
			return [];
		}
	};

	const getExpensesByMonth = (date: Date) => {
		try {
			const expensesInCurrentDate = allExpenses.filter((expense) => {
				const expensePaidAt = new Date(expense.paid_at);

				const sameMonth = expensePaidAt.getMonth() === date.getMonth();
				const sameYear = expensePaidAt.getFullYear() === date.getFullYear();

				if (sameMonth && sameYear) return expense;
			});

			return expensesInCurrentDate;
		} catch (error) {
			console.log('Failed to retrieve your data!');
			return [];
		}
	};

	const getExpenseById = (_id: number): ExpenseDataTypes => {
		const expense = allExpenses.find((expense) => expense.id === _id);
		if (!expense) {
			throw new Error(`Expense with id ${_id} not found`);
		}
		return expense;
	};

	const deleteExpenseById = async (_id: number) => {
		try {
			setLoading(true);
			const newData = allExpenses.filter((expense) => expense.id !== _id);

			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
			setallExpenses((prevData) => newData);
		} catch (error) {
			console.log('Failed to delete your data!');
		} finally {
			setLoading(false);
		}
	};

	const updateExpenseData = async (payload: ExpenseDataTypes, id: number) => {
		try {
			setLoading(true);
			const expense = allExpenses.filter((expense) => expense.id === id)[0];
			expense.category = payload.category;
			expense.description = payload.description;
			expense.total = payload.total;
			expense.wallet = payload.wallet;
			expense.transaction_type = payload.transaction_type;
			expense.paid_at = payload.paid_at;

			const newData = [
				expense,
				...allExpenses.filter((expense) => expense.id !== id),
			];

			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
			setallExpenses((prevData) => newData);
			return { success: true };
		} catch (error) {
			console.log('Failed to save your data!');
		} finally {
			setLoading(false);
		}
	};

	const clearData = async () => {
		try {
			await AsyncStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			setLoading(false);
		}
	};

	return (
		<ExpenseContext.Provider
			value={{
				allExpenses,
				loading,
				saveExpenses,
				getExpensesByDate,
				getExpensesByMonth,
				getExpenseById,
				deleteExpenseById,
				updateExpenseData,
				getCurrentBalance,
				clearData,
			}}
		>
			{children}
		</ExpenseContext.Provider>
	);
};

export default ExpenseProvider;
