import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'USER_PREFERENCE';

export interface UserPreferenceContextTypes {
	loading: boolean;
	userPreference: UserPreference;
	currentAppTheme: AppTheme;
	currentAppColor: AppColor;
	currentCurrencySymbol: CurrencySymbols;
	firstTimer: boolean;
	setAppColor: (selectedColor: AppColor) => void;
	setAppTheme: (selectedTheme: AppTheme) => void;
	setAppCurrencySymbol: (selectedSymbol: CurrencySymbols) => void;
	setFirstTimer: (newState: boolean) => void;
	resetUserPreferenceData: () => void;
}

export const UserPreferenceContext = createContext<
	UserPreferenceContextTypes | undefined
>(undefined);

const UserPreferenceProvider = ({ children }: { children: ReactNode }) => {
	const [userPreference, setUserPreference] = useState<UserPreference>({
		currentCurrencySymbol: 'Rp',
		currentAppColor: 'Default',
		currentAppTheme: 'Dark',
		firstTimer: true,
	});
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		loadUserPreferenceData();
	}, []);

	const loadUserPreferenceData = async () => {
		try {
			const storedData = await AsyncStorage.getItem(STORAGE_KEY);
			if (storedData) {
				setUserPreference(JSON.parse(storedData));
			}
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	};

	const resetUserPreferenceData = async () => {
		try {
			setLoading(true);

			const resettedData: UserPreference = {
				currentAppColor: 'Default',
				currentAppTheme: 'Device',
				currentCurrencySymbol: 'Rp',
				firstTimer: true,
			};
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resettedData));
			setUserPreference(resettedData);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 1500);
		}
	};

	const setAppColor = async (selectedColor: AppColor) => {
		try {
			setLoading(true);
			const newData = { ...userPreference, currentAppColor: selectedColor };
			setUserPreference((prevData) => ({
				...prevData,
				currentAppColor: selectedColor,
			}));
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	};

	const setAppCurrencySymbol = async (selectedSymbol: CurrencySymbols) => {
		try {
			setLoading(true);
			const newData = {
				...userPreference,
				currentCurrencySymbol: selectedSymbol,
			};
			setUserPreference((prevData) => ({
				...prevData,
				currentCurrencySymbol: selectedSymbol,
			}));
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.CENTER);
		} finally {
			setLoading(false);
		}
	};

	const setAppTheme = async (selectedTheme: AppTheme) => {
		try {
			setLoading(true);
			const newData = { ...userPreference, currentAppTheme: selectedTheme };
			setUserPreference((prevData) => ({
				...prevData,
				currentAppTheme: selectedTheme,
			}));
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	};

	const setFirstTimer = async (newState: boolean) => {
		try {
			setLoading(true);
			const newData = { ...userPreference, firstTimer: newState };
			setUserPreference((prevData) => ({
				...prevData,
				firstTimer: newState,
			}));
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	};

	return (
		<UserPreferenceContext.Provider
			value={{
				userPreference,
				loading,
				firstTimer: userPreference.firstTimer,
				currentAppTheme: userPreference.currentAppTheme,
				currentAppColor: userPreference.currentAppColor,
				currentCurrencySymbol: userPreference.currentCurrencySymbol,
				setAppColor,
				setAppTheme,
				setAppCurrencySymbol,
				setFirstTimer,
				resetUserPreferenceData,
			}}
		>
			{children}
		</UserPreferenceContext.Provider>
	);
};

export default UserPreferenceProvider;
