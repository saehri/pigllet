import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type useAppThemeStore = {
	currentAppTheme: AppTheme;
	setAppTheme: (appTheme: AppTheme) => void;
};

export const useAppThemeStore = create<useAppThemeStore>()(
	persist(
		(set, get) => ({
			currentAppTheme: 'Light',
			setAppTheme: (appTheme) => set({ currentAppTheme: appTheme }),
		}),
		{
			name: 'app-theme-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				currentAppTheme: state.currentAppTheme,
			}),
		}
	)
);

