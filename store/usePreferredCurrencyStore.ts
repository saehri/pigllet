import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CurrencySymbols } from '@/types/type';

type usePreferredCurrencyStore = {
	currentCurrencySymbol: CurrencySymbols;
	setAppCurrencySymbol: (currencySymbol: CurrencySymbols) => void;
};

export const usePreferredCurrencyStore = create<usePreferredCurrencyStore>()(
	persist(
		(set, get) => ({
			currentCurrencySymbol: 'Rp',
			setAppCurrencySymbol: (currentCurrencySymbol) =>
				set({ currentCurrencySymbol }),
		}),
		{
			name: 'preferrable-currency-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				currentCurrencySymbol: state.currentCurrencySymbol,
			}),
		}
	)
);

