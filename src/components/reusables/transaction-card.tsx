import IncomeCard from './income-card';
import ExpenseCard from './expense-card';
import TransferCard from './transfer-card';
import {
	Accounts,
	Expense,
	ExpenseCategory,
	Income,
	IncomeCategory,
	Transfer,
	TransferCategory,
} from '@/db/schema';

interface TransactionCard {
	transactionType: 'expense' | 'income' | 'transfer';
	data: Expense | Income | Transfer;
	account: Accounts;
	category: ExpenseCategory | IncomeCategory | TransferCategory;
}

export default function TransactionCard({
	transactionType,
	data,
	account,
	category,
}: TransactionCard) {
	if (transactionType === 'expense')
		return (
			<ExpenseCard
				account={account}
				category={category}
				data={data as Expense}
			/>
		);
	if (transactionType === 'income')
		return (
			<IncomeCard account={account} category={category} data={data as Income} />
		);
	else
		return (
			<TransferCard
				account={account}
				category={category}
				data={data as Transfer}
			/>
		);
}
