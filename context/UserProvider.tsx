import React, { createContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'USER';

export type UserDataTypes = {
	id: number;
	name: string;
	email: string;
};

/* -------------------- DUMMY */

export interface UserContextTypes {
	loading: boolean;
	user: UserDataTypes;
}

export const UserContext = createContext<UserContextTypes | undefined>(
	undefined
);

const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserDataTypes>({
		id: 1,
		name: 'Bahree',
		email: 'bahreesaepul1@gmail.com',
	});
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		loadUser();
	}, []);

	const loadUser = async () => {
		try {
			const storedExpenses = await AsyncStorage.getItem(STORAGE_KEY);
			if (storedExpenses) {
				setUser(JSON.parse(storedExpenses));
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<UserContext.Provider
			value={{
				user,
				loading,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
