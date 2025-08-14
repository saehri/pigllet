import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type usePreferredStatsWindow = {
	showExpenseByDate: boolean;
	showIncomeByDate: boolean;
	showTransferByDate: boolean;
	showExpenseByCategory: boolean;
	showIncomeByCategory: boolean;
	showTransferByCategory: boolean;
	setShowExpenseByDate: (state: boolean) => void;
	setShowIncomeByDate: (state: boolean) => void;
	setShowTransferByDate: (state: boolean) => void;
	setShowExpenseByCategory: (state: boolean) => void;
	setShowIncomeByCategory: (state: boolean) => void;
	setShowTransferByCategory: (state: boolean) => void;
};

export const usePreferredStatsWindow = create<usePreferredStatsWindow>()(
	persist(
		(set) => ({
			showExpenseByDate: true,
			showIncomeByDate: true,
			showTransferByDate: true,
			showExpenseByCategory: true,
			showIncomeByCategory: true,
			showTransferByCategory: true,
			setShowExpenseByDate: (state) => set({ showExpenseByDate: state }),
			setShowIncomeByDate: (state) => set({ showIncomeByDate: state }),
			setShowTransferByDate: (state) => set({ showTransferByDate: state }),
			setShowExpenseByCategory: (state) =>
				set({ showExpenseByCategory: state }),
			setShowIncomeByCategory: (state) => set({ showIncomeByCategory: state }),
			setShowTransferByCategory: (state) =>
				set({ showTransferByCategory: state }),
		}),
		{
			name: 'preferred-stats-windows',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				showExpenseByDate: state.showExpenseByDate,
				showIncomeByDate: state.showIncomeByDate,
				showTransferByDate: state.showTransferByDate,
				showExpenseByCategory: state.showExpenseByCategory,
				showIncomeByCategory: state.showIncomeByCategory,
				showTransferByCategory: state.showTransferByCategory,
			}),
		}
	)
);

