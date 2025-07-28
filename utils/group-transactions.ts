import moment from 'moment';

import { Account, Transaction as BaseTransaction, Category } from '@/db/schema';

export interface TransactionWithDetails {
	transaction: BaseTransaction;
	account: Account;
	category: Category;
	related_account: Account;
}

type StackItem = {
	value: number;
	color: string;
	marginBottom?: number;
};

type StackDataItem = {
	stacks: StackItem[];
	label: string;
};

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

// Simple color mapping per category type
const colorMap: Record<string, string> = {
	income: 'rgba(21, 179, 15, 1)',
	expense: 'rgba(248, 110, 30, 1)',
	transfer: 'rgba(0, 150, 150, 1)',
};

export async function getStackedChartDataByDate(
	transactions: TransactionWithDetails[],
	dateFormat: string
): Promise<StackDataItem[]> {
	// Only allow valid transaction types as keys
	type TxType = 'income' | 'expense' | 'transfer';
	const validTypes: TxType[] = ['income', 'expense', 'transfer'];

	const grouped: Record<string, Record<TxType, number>> = {};

	for (const tx of transactions) {
		const label = moment(tx.transaction.created_at).format(dateFormat);
		const type = tx.transaction.type;

		// Only process valid types
		if (!validTypes.includes(type as TxType)) continue;

		if (!grouped[label]) {
			grouped[label] = { income: 0, expense: 0, transfer: 0 };
		}

		grouped[label][type as TxType] += tx.transaction.amount;
	}

	const stackData: StackDataItem[] = Object.entries(grouped).map(
		([label, types]) => {
			const stacks: StackItem[] = [];

			if (types.expense > 0) {
				stacks.push({ value: types.expense, color: colorMap.expense });
			}

			if (types.income > 0) {
				stacks.push({
					value: types.income,
					color: colorMap.income,
					marginBottom: stacks.length > 0 ? 2 : undefined,
				});
			}

			if (types.transfer > 0) {
				stacks.push({
					value: types.transfer,
					color: colorMap.transfer,
					marginBottom: stacks.length > 0 ? 2 : undefined,
				});
			}

			return { label, stacks };
		}
	);

	return stackData;
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
				existingCategory.value += transaction.transaction.amount;
			} else {
				acc.push({
					label: categoryName,
					value: transaction.transaction.amount,
				});
			}

			return acc;
		},
		[]
	);
}

export async function getChartDataByType(
	transactions: TransactionWithDetails[]
): Promise<GroupedTransactionByCategory[]> {
	return transactions.reduce<GroupedTransactionByCategory[]>(
		(acc, transaction) => {
			const type = transaction.transaction.type;

			const existingTypes = acc.find((group) => group.label === type);

			if (existingTypes) {
				existingTypes.value += transaction.transaction.amount;
			} else {
				acc.push({
					label: type,
					value: transaction.transaction.amount,
				});
			}

			return acc;
		},
		[]
	);
}

export async function getChartDataByDate(
	transactions: TransactionWithDetails[]
): Promise<GroupedTransactionByCategory[]> {
	return transactions.reduce<GroupedTransactionByCategory[]>(
		(acc, transaction) => {
			const date = new Date(
				transaction.transaction.created_at
			).toLocaleDateString('en-US', {
				dateStyle: 'medium',
			});
			const existingDate = acc.find((group) => group.label === date);

			if (existingDate) {
				existingDate.value += transaction.transaction.amount;
			} else {
				acc.push({
					label: date,
					value: transaction.transaction.amount,
				});
			}

			return acc;
		},
		[]
	);
}

