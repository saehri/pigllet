import { usePreferredStatsWindow } from '@/store/usePreferredStatsWindow';

import TransactionsByCategory from '../charts/transactions-by-category';
import TransactionsOverTime from './transactions-over-time';

type WrapperProps = {
	selectedDate?: Date;
	range?: 'month' | 'year' | 'week';
	name: string;
	descriptions: string;
	initialSorting?: 'asc' | 'desc';
};

export function ExpensesOverTimeWrapper({
	selectedDate,
	range,
	name,
	descriptions,
	initialSorting,
}: WrapperProps) {
	const isWidgetVisible = usePreferredStatsWindow((s) => s.showExpenseByDate);

	if (isWidgetVisible)
		return (
			<TransactionsOverTime
				name={name}
				descriptions={descriptions}
				transactionType="expense"
				range={range}
				selectedDate={selectedDate}
				initialSorting={initialSorting}
			/>
		);

	return <></>;
}

export function IncomesOverTimeWrapper({
	selectedDate,
	range,
	name,
	descriptions,
	initialSorting,
}: WrapperProps) {
	const isWidgetVisible = usePreferredStatsWindow((s) => s.showIncomeByDate);

	if (isWidgetVisible)
		return (
			<TransactionsOverTime
				name={name}
				descriptions={descriptions}
				transactionType="income"
				range={range}
				selectedDate={selectedDate}
				initialSorting={initialSorting}
			/>
		);

	return <></>;
}

export function TransfersOverTimeWrapper({
	selectedDate,
	range,
	name,
	descriptions,
	initialSorting,
}: WrapperProps) {
	const isWidgetVisible = usePreferredStatsWindow((s) => s.showTransferByDate);

	if (isWidgetVisible)
		return (
			<TransactionsOverTime
				name={name}
				descriptions={descriptions}
				transactionType="transfer"
				range={range}
				selectedDate={selectedDate}
				initialSorting={initialSorting}
			/>
		);

	return <></>;
}

export function ExpensesByCategoryWrapper({
	selectedDate,
	range,
	descriptions,
	name,
	initialSorting,
}: WrapperProps) {
	const isWidgetVisible = usePreferredStatsWindow(
		(s) => s.showExpenseByCategory
	);

	if (isWidgetVisible)
		return (
			<TransactionsByCategory
				type="expense"
				range={range}
				selectedDate={selectedDate}
				name={name}
				initialSorting={initialSorting}
				descriptions={descriptions}
			/>
		);

	return <></>;
}

export function IncomesByCategoryWrapper({
	selectedDate,
	range,
	name,
	descriptions,
	initialSorting,
}: WrapperProps) {
	const isWidgetVisible = usePreferredStatsWindow(
		(s) => s.showIncomeByCategory
	);

	if (isWidgetVisible)
		return (
			<TransactionsByCategory
				type="income"
				range={range}
				selectedDate={selectedDate}
				name={name}
				initialSorting={initialSorting}
				descriptions={descriptions}
			/>
		);

	return <></>;
}

export function TransfersByCategoryWrapper({
	selectedDate,
	range,
	name,
	initialSorting,
}: WrapperProps) {
	const isWidgetVisible = usePreferredStatsWindow(
		(s) => s.showTransferByCategory
	);

	if (isWidgetVisible)
		return (
			<TransactionsByCategory
				type="transfer"
				range={range}
				selectedDate={selectedDate}
				initialSorting={initialSorting}
				name={name}
			/>
		);

	return <></>;
}

