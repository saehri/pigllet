import { create } from 'zustand';

type useSelectedCategoryTypes = {
	selectedCategories: number[];
	setSelectedCategories: (id: number[]) => void;
};

export const useSelectedCategory = create<useSelectedCategoryTypes>((set) => ({
	selectedCategories: [],
	setSelectedCategories: (selectedCategories) => set({ selectedCategories }),
}));
