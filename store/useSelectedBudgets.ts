import { create } from 'zustand';

type useSelectedBudgets = {
	selectedBudgets: number[];
	setSelectedBudgets: (id: number[]) => void;
};

export const useSelectedBudgets = create<useSelectedBudgets>((set) => ({
	selectedBudgets: [],
	setSelectedBudgets: (selectedBudgets) => set({ selectedBudgets }),
}));
