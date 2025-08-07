import { create } from 'zustand';

type SelectedTransactionsState = {
	selectedTransactions: number[];
	setSelectedTransactions: (ids: number[]) => void;
};

export const useSelectedTransactions = create<SelectedTransactionsState>(
	(set) => ({
		selectedTransactions: [],
		setSelectedTransactions: (ids) => set({ selectedTransactions: ids }),
	})
);

