import {
	Transaction as BaseTransaction,
	TransactionCategories,
} from '@/db/schema';

interface Transaction extends BaseTransaction {
	category?: TransactionCategories;
}

interface GroupedTransactionByCategory {
	label: string;
	value: number;
}

interface GroupedTransactionByDate {
	created_date: number;
	transactions: Transaction[];
}

export function groupedTransactionsByDate(
	transactions: Transaction[]
): GroupedTransactionByDate[] {
	return transactions.reduce((acc: GroupedTransactionByDate[], transaction) => {
		const date = transaction.created_date;
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
	}, []);
}

export async function groupTransactionsByCategory(
	transactions: Transaction[]
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
