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
	transactions: GroupedTransactionsByDateInput[]
): GroupedTransactionByDateOutput[] {
	return transactions.reduce(
		(acc: GroupedTransactionByDateOutput[], transaction) => {
			const date = new Date(
				transaction.transaction.created_at
			).toLocaleDateString('en-US', {
				dateStyle: 'long',
				month: 'short',
			});

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
				existingCategory.value += transaction.amount;
			} else {
				acc.push({
					label: categoryName,
					value: transaction.amount,
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
			const date = new Date(transaction.created_at).toLocaleDateString(
				'en-US',
				{
					dateStyle: 'medium',
				}
			);
			const existingDate = acc.find((group) => group.label === date);

			if (existingDate) {
				existingDate.value += transaction.amount;
			} else {
				acc.push({
					label: date,
					value: transaction.amount,
				});
			}

			return acc;
		},
		[]
	);
}

