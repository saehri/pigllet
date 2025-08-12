import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CurrencyCode } from '@/constants/currency-symbols';

type usePreferredCurrencyStore = {
	currentCurrencyCode: CurrencyCode;
	setAppCurrencyCode: (currencySymbol: CurrencyCode) => void;
};

export const usePreferredCurrencyStore = create<usePreferredCurrencyStore>()(
	persist(
		(set) => ({
			currentCurrencyCode: 'IDR',
			setAppCurrencyCode: (currentCurrencyCode) => set({ currentCurrencyCode }),
		}),
		{
			name: 'preferrable-currency-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				currentCurrencyCode: state.currentCurrencyCode,
			}),
		}
	)
);

