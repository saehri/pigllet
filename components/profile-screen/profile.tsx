import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import ProfileIcon from '@/assets/svg/settings/profile.svg';
import CloudAlertIcon from '@/assets/svg/settings/cloud-alert.svg';
import { UserContext, UserContextTypes } from '@/context/UserProvider';

const Profile = ({ userSession }: any) => {
	return (
		<View className="relative  bg-white p-4 rounded-2xl border border-slate-200 flex-row justify-between">
			<View className="flex-row">
				<View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center">
					<ProfileIcon />
				</View>

				<View className="pl-4">

					<Text className="text-xl tracking-tight">
						{userSession?.username || 'Guest'}
					</Text>
					<Text className="text-slate-600 tracking-tight">
						{userSession?.email || 'Guest@example.com'}
					</Text>
				</View>
			</View>

			<View>
				<CloudAlertIcon />
			</View>
		</View>
	);
};

export default Profile;
