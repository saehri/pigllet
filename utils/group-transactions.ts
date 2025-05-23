import { Transaction as BaseTransaction, Category } from '@/db/schema';

interface Transaction extends BaseTransaction {
	category?: Category;
}

interface GroupedTransactionByCategory {
	label: string;
	value: number;
}

interface GroupedTransactionByDate {
	created_date: string;
	transactions: Transaction[];
}

export function groupedTransactionsByDate(
	transactions: Transaction[]
): GroupedTransactionByDate[] {
	return transactions.reduce((acc: GroupedTransactionByDate[], transaction) => {
		const date = new Date(transaction.created_at).toLocaleDateString('en-US', {
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
	}, []);
}

export function getChartDataByCategory(
	transactions: Transaction[]
): GroupedTransactionByCategory[] {
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

export function getChartDataByDate(
	transactions: Transaction[]
): GroupedTransactionByCategory[] {
	return transactions.reduce<GroupedTransactionByCategory[]>(
		(acc, transaction) => {
			const date = new Date(transaction.created_at).toLocaleDateString(
				'en-US',
				{
					dateStyle: 'medium',
					// month: '',
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

