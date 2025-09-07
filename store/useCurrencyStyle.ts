import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CurrencyCode } from '@/constants/currency-symbols';

type useCurrencyStyle = {
	showSuffix: boolean;
	showFraction: boolean;
	accountingStyle: boolean;
	currentCurrencyCode: CurrencyCode;
	setShowSufix: (state: boolean) => void;
	setShowFraction: (state: boolean) => void;
	setAccountingStyle: (state: boolean) => void;
	setAppCurrencyCode: (currencyCode: CurrencyCode) => void;
};

export const useCurrencyStyle = create<useCurrencyStyle>()(
	persist(
		(set) => ({
			showSuffix: true,
			showFraction: true,
			accountingStyle: true,
			currentCurrencyCode: 'IDR',
			setShowSufix: (state) => set({ showSuffix: state }),
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
				showSuffix: state.showSuffix,
			}),
		}
	)
);

