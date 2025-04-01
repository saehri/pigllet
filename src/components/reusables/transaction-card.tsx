import { Accounts, Transaction, TransactionCategories } from '@/db/schema';

import IncomeCard from './income-card';
import ExpenseCard from './expense-card';
import TransferCard from './transfer-card';

interface TransactionCard {
	transactionType: 'expense' | 'income' | 'transfer';
	data: Transaction;
	account: Accounts;
	relatedAccount?: Accounts;
	category: TransactionCategories;
	disableFirstButton?: boolean;
	disableSecondButton?: boolean;
}

export default function TransactionCard({
	transactionType,
	data,
	account,
	category,
	disableSecondButton = false,
	disableFirstButton = false,
	relatedAccount,
}: TransactionCard) {
	if (transactionType === 'expense')
		return (
			<ExpenseCard
				disableSecondButton={disableSecondButton}
				disableFirstButton={disableFirstButton}
				category={category}
				data={data}
				accountName={account.name}
			/>
		);
	if (transactionType === 'income')
		return <IncomeCard accounts={account} category={category} data={data} />;

	return (
		<TransferCard
			relatedAccount={relatedAccount!}
			accounts={account}
			category={category}
			data={data}
		/>
	);
}
