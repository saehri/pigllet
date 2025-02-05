import { View, Text } from 'react-native';
import React from 'react';
import AccountCircleIcon from '@/assets/svg/settings/account-circle.svg';
import { Link } from 'expo-router';

const NotLoggedInAllert = () => {
	return (
		<View className="relative w-full bg-red-100 rounded-2xl border border-red-200 p-4">
			<View className="flex-row w-full items-start">
				<AccountCircleIcon />

				<View className="pl-2 w-[90%] relative">
					<Text className="text-lg text-red-900 tracking-tight">
						You are not logged in!
					</Text>

					<Text className="text-slate-700 tracking-tight">
						You need to login to use all the feature in this application.
					</Text>

					<Link
						href={'/(auth)/login-screen'}
						className="p-1 px-4 bg-red-400 w-32 mt-4 rounded-lg border border-red-500"
					>
						<Text className="text-center text-lg tracking-tight text-white">
							Login now
						</Text>
					</Link>
				</View>
			</View>
		</View>
	);
};

export default NotLoggedInAllert;
