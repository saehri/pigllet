import { Transaction } from '@/db/schema';

interface GroupedTransaction {
	created_date: number;
	transactions: Transaction[];
}

export default function groupedTransactions(
	transactions: Transaction[]
): GroupedTransaction[] {
	return transactions.reduce((acc: GroupedTransaction[], transaction) => {
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
