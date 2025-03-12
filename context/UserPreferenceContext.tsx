import { ToastAndroid } from 'react-native';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'USER_PREFERENCE';

export interface UserPreferenceContextTypes {
	loading: boolean;
	userPreference: UserPreference;
	currentAppTheme: AppTheme;
	currentAppColor: AppColor;
	setAppColor: (selectedColor: AppColor) => void;
	setAppTheme: (selectedTheme: AppTheme) => void;
}

export const UserPreferenceContext = createContext<
	UserPreferenceContextTypes | undefined
>(undefined);

const UserPreferenceProvider = ({ children }: { children: ReactNode }) => {
	const [userPreference, setUserPreference] = useState<UserPreference>({
		currentAppColor: 'default',
		currentAppTheme: 'dark',
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

	const setAppColor = async (selectedColor: AppColor) => {
		try {
			setLoading(true);
			const newData = { ...userPreference, currentAppColor: selectedColor };
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
			setUserPreference((prevData) => ({
				...prevData,
				currentAppColor: selectedColor,
			}));
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
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
			setUserPreference((prevData) => ({
				...prevData,
				currentAppTheme: selectedTheme,
			}));
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
				currentAppTheme: userPreference.currentAppTheme,
				currentAppColor: userPreference.currentAppColor,
				setAppColor,
				setAppTheme,
			}}
		>
			{children}
		</UserPreferenceContext.Provider>
	);
};

export default UserPreferenceProvider;
