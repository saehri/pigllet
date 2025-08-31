import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CurrencyCode } from '@/constants/currency-symbols';

type usePreferredCurrencyStore = {
	showFraction: boolean;
	accountingStyle: boolean;
	currentCurrencyCode: CurrencyCode;
	setShowFraction: (state: boolean) => void;
	setAccountingStyle: (state: boolean) => void;
	setAppCurrencyCode: (currencyCode: CurrencyCode) => void;
};

export const usePreferredCurrencyStore = create<usePreferredCurrencyStore>()(
	persist(
		(set) => ({
			showFraction: true,
			accountingStyle: false,
			currentCurrencyCode: 'IDR',
			setShowFraction: (state) => set({ showFraction: state }),
			setAccountingStyle: (state) => set({ accountingStyle: state }),
			setAppCurrencyCode: (currentCurrencyCode) => set({ currentCurrencyCode }),
		}),
		{
			name: 'preferrable-currency-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				currentCurrencyCode: state.currentCurrencyCode,
				showFraction: state.showFraction,
				accountingStyle: state.accountingStyle,
			}),
		}
	)
);

