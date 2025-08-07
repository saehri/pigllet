import moment from 'moment';

import { Account, Transaction as BaseTransaction, Category } from '@/db/schema';

export interface TransactionWithDetails {
	transaction: BaseTransaction;
	account: Account;
	category: Category;
	related_account: Account;
}

interface GroupedTransactionByCategory {
	label: string;
	value: number;
}

type GroupedTransactionsByDateInput = {
	transaction: BaseTransaction;
	account: Account;
	category: Category;
	related_account: Account;
};

export type GroupedTransactionByDateOutput = {
	created_date: string;
	transactions: GroupedTransactionsByDateInput[];
};

export function groupedTransactionsByDate(
	transactions: GroupedTransactionsByDateInput[],
	dateFormat: string
): GroupedTransactionByDateOutput[] {
	return transactions.reduce(
		(acc: GroupedTransactionByDateOutput[], transaction) => {
			const date = moment(transaction.transaction.created_at).format(
				dateFormat
			);

			const existingGroup = acc.find((group) => group.created_date === date);

			if (existingGroup) {
				existingGroup.transactions.push(transaction);
			} else {
				acc.push({
					created_date: date,
					transactions: [transaction],
				});
			}

			return acc;
		},
		[]
	);
}

export async function getChartDataByCategory(
	transactions: TransactionWithDetails[]
): Promise<GroupedTransactionByCategory[]> {
	return transactions.reduce<GroupedTransactionByCategory[]>(
		(acc, transaction) => {
			const categoryName = transaction.category?.label!;
			const existingCategory = acc.find(
				(group) => group.label === categoryName
			);

			if (existingCategory) {
				existingCategory.value += transaction.transaction.amount / 1000;
			} else {
				acc.push({
					label: categoryName,
					value: transaction.transaction.amount / 1000,
				});
			}

			return acc;
		},
		[]
	);
}

export async function getChartDataByDate(
	chartData: { value: number; label: string }[]
): Promise<GroupedTransactionByCategory[]> {
	return chartData.reduce<GroupedTransactionByCategory[]>(
		(acc, transaction) => {
			const date = new Date(transaction.label).toLocaleDateString('en-US', {
				dateStyle: 'medium',
			});
			const existingDate = acc.find((group) => group.label === date);

			if (existingDate) {
				existingDate.value += transaction.value;
			} else {
				acc.push({
					label: date,
					value: transaction.value,
				});
			}

			return acc;
		},
		[]
	);
}

