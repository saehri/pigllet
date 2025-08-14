import { usePreferredStatsWindow } from '@/store/usePreferredStatsWindow';

import TransactionsByCategory from '../charts/transactions-by-category';
import TransactionsOverTime from './transactions-over-time';

type WrapperProps = {
	selectedDate?: Date;
	range?: 'month' | 'year';
};

export function ExpensesOverTimeWrapper({ selectedDate, range }: WrapperProps) {
	const isWidgetVisible = usePreferredStatsWindow((s) => s.showExpenseByDate);

	if (isWidgetVisible)
		return (
			<TransactionsOverTime
				name="Your expenses this month"
				descriptions="See how much you spend daily"
				transactionType="expense"
				range={range}
				selectedDate={selectedDate}
			/>
		);

	return <></>;
}

export function IncomesOverTimeWrapper({ selectedDate, range }: WrapperProps) {
	const isWidgetVisible = usePreferredStatsWindow((s) => s.showIncomeByDate);

	if (isWidgetVisible)
		return (
			<TransactionsOverTime
				name="Your incomes this month"
				descriptions="See how much you earn daily"
				transactionType="income"
				range={range}
				selectedDate={selectedDate}
			/>
		);

	return <></>;
}

export function TransfersOverTimeWrapper({
	selectedDate,
	range,
}: WrapperProps) {
	const isWidgetVisible = usePreferredStatsWindow((s) => s.showTransferByDate);

	if (isWidgetVisible)
		return (
			<TransactionsOverTime
				name="Money transfered this month"
				descriptions="See how your money moves between accounts"
				transactionType="transfer"
				range={range}
				selectedDate={selectedDate}
			/>
		);

	return <></>;
}

export function ExpensesByCategoryWrapper({
	selectedDate,
	range,
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
				name="Where your money goes"
				descriptions="See the distribution of expenses by category"
			/>
		);

	return <></>;
}

export function IncomesByCategoryWrapper({
	selectedDate,
	range,
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
				name="Where your money comes"
				descriptions="See the distribution of incomes by category"
			/>
		);

	return <></>;
}

export function TransfersByCategoryWrapper({
	selectedDate,
	range,
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
				name="Transfers by category"
			/>
		);

	return <></>;
}

