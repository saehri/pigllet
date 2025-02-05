import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'USERS';
const USER_KEY_LOGIN = 'USER_LOGIN';

export type UserDataTypes = {
	id: number;
	fullname: string;
	username: string;
	email: string;
	birthday: string;
	gender: string;
	password: string;
};

export interface AuthContextTypes {
	loading: boolean;
	userData: UserDataTypes[];
	userSession: UserDataTypes | null;
	login: (email: string, password: string) => void;
	register: (payload: UserDataTypes) => Promise<void>;
	logout: () => void;
	getUserById: (id: number) => Promise<UserDataTypes>;
}

export const AuthContext = createContext<AuthContextTypes | undefined>(
	undefined
);

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [userData, setUserData] = useState<UserDataTypes[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [userSession, setUserSession] = useState<UserDataTypes | null>(null);

	useEffect(() => {
		const loadUserData = async () => {
			try {
				setLoading(true);
				const storedUserData = await AsyncStorage.getItem(STORAGE_KEY);
				if (storedUserData) {
					setUserData(JSON.parse(storedUserData));
				}

				const storedUserSession = await AsyncStorage.getItem(USER_KEY_LOGIN);
				if (storedUserSession) {
					setUserSession(JSON.parse(storedUserSession));
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		loadUserData();
	}, []);

	const login = async (email: string, password: string) => {
		try {
			setLoading(true);
			const storedUserData = await AsyncStorage.getItem(STORAGE_KEY);

			if (storedUserData) {
				const users: UserDataTypes[] = JSON.parse(storedUserData);
				const user = users.find(
					(u) => u.email === email && u.password === password
				);

				if (user) {
					setUserSession(user);
					await AsyncStorage.setItem(USER_KEY_LOGIN, JSON.stringify(user));
				} else {
					console.log('Invalid email or password');
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const register = async (payload: UserDataTypes) => {
		try {
			setLoading(true);
			const newUser = [payload, ...userData];
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
			setUserData((prevData) => [payload, ...prevData]);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			setLoading(true);
			await AsyncStorage.removeItem(USER_KEY_LOGIN);
			setUserSession(null);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const getUserById = async (id: number): Promise<UserDataTypes> => {
		const user = userData.find((u) => u.id === id);

		if (!user) {
			throw new Error(`User with ID ${id} not found`);
		}

		return user;
	};

	return (
		<AuthContext.Provider
			value={{
				loading,
				userData,
				userSession,
				login,
				register,
				logout,
				getUserById,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
