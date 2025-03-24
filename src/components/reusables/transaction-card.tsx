import IncomeCard from './income-card';
import ExpenseCard from './expense-card';
import TransferCard from './transfer-card';
import { Accounts, Transaction, TransactionCategories } from '@/db/schema';

interface TransactionCard {
	transactionType: 'expense' | 'income' | 'transfer';
	data: Transaction;
	account: Accounts;
	category: TransactionCategories;
}

export default function TransactionCard({
	transactionType,
	data,
	account,
	category,
}: TransactionCard) {
	if (transactionType === 'expense')
		return <ExpenseCard category={category} data={data} />;
	if (transactionType === 'income')
		return <IncomeCard accounts={account} category={category} data={data} />;

	return <TransferCard account={account} category={category} data={data} />;
}
