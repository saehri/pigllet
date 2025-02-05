import { Text, TouchableOpacity, View } from 'react-native';

import NotifIcon from '@/assets/svg/home/notif-active.svg';
import { useContext } from 'react';
import { UserContext, UserContextTypes } from '@/context/UserProvider';
import { AuthContext, AuthContextTypes } from '@/context/AuthProvider';

export default function Greeting() {
	const greetings = greetingLabel();
	const { userSession } = useContext(AuthContext) as AuthContextTypes;

	return (
		<View className="flex-row justify-between items-center px-6 pt-16">
			<View>
				<Text className="text-4xl tracking-tighter">
					Hi, {userSession?.fullname || 'Guest'}
				</Text>
				<Text className="text-slate-600 tracking-tight">{greetings}</Text>
			</View>

			<TouchableOpacity className="w-12 h-12 items-center justify-center rounded-full">
				<NotifIcon />
			</TouchableOpacity>
		</View>
	);
}

function greetingLabel() {
	const hour = new Date().getHours();
	if (hour > 1 && hour < 10) return 'Good morning!';
	if (hour >= 10 && hour < 17) return 'Good afternoon!';
	if (hour >= 17) return 'Good evening!';
}
