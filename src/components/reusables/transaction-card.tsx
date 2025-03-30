import { Accounts, Transaction, TransactionCategories } from '@/db/schema';

import IncomeCard from './income-card';
import ExpenseCard from './expense-card';
import TransferCard from './transfer-card';

interface TransactionCard {
	transactionType: 'expense' | 'income' | 'transfer';
	data: Transaction;
	account: Accounts;
	category: TransactionCategories;
	showsIncomeDate?: boolean;
}

export default function TransactionCard({
	transactionType,
	data,
	account,
	category,
	showsIncomeDate = true,
}: TransactionCard) {
	if (transactionType === 'expense')
		return (
			<ExpenseCard category={category} data={data} accountName={account.name} />
		);
	if (transactionType === 'income')
		return (
			<IncomeCard
				accounts={account}
				category={category}
				data={data}
				showsDate={showsIncomeDate}
			/>
		);

	return <TransferCard account={account} category={category} data={data} />;
}
