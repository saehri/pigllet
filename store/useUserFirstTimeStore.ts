import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type useUserFirstTimeStore = {
	firstTimer: boolean;
	setFirstTimer: (state: boolean) => void;
};

export const useUserFirstTimeStore = create<useUserFirstTimeStore>()(
	persist(
		(set, get) => ({
			firstTimer: true,
			setFirstTimer: (firstTimer) => set({ firstTimer }),
		}),
		{
			name: 'app-theme-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				firstTimer: state.firstTimer,
			}),
		}
	)
);

