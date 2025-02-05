import { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Pressable,
} from 'react-native';
import Profile from '@/components/profile-screen/profile';
import NotLoggedInAllert from '@/components/profile-screen/not-loggedin-alert';
import UserSettings from '@/components/profile-screen/user-setting';
import EmailIcon from '@/assets/svg/settings/email.svg';
import LockIcon from '@/assets/svg/settings/lock.svg';
import FingerPrintIcon from '@/assets/svg/settings/finger-print.svg';
import DeleteForeverIcon from '@/assets/svg/settings/delete-forever.svg';
import { useContext } from 'react';
import { AuthContext, AuthContextTypes } from '@/context/AuthProvider';
import Button from '@/components/buttons/custom-button';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
	const { userSession, logout } = useContext(AuthContext) as AuthContextTypes;
	const [isProfileClicked, setIsProfileClicked] = useState(false);
	const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

	const router = useRouter();

	const handleLogout = () => {
		logout();
		setIsConfirmationVisible(false);

		setTimeout(() => {
			router.replace('/(root)/home-screen');
		}, 1000);
	};

	const handleCloseConfirmation = () => {
		setIsConfirmationVisible(false);
	};

	return (
		<ScrollView
			className="w-full h-full pt-16 px-6 bg-slate-100"
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 80 }}
		>
			<Text className="text-center text-2xl font-bold tracking-tight">
				Settings
			</Text>
			<View className="relative w-full pt-8 gap-5">
				<TouchableOpacity
					onPress={() => setIsProfileClicked(!isProfileClicked)}
				>
					<Profile userSession={userSession} />
				</TouchableOpacity>

				{!userSession ? <NotLoggedInAllert /> : ''}

				{userSession && isProfileClicked && (
					<TouchableOpacity
						className="relative w-full bg-red-100 rounded-2xl border border-red-200 p-4"
						onPress={() => setIsConfirmationVisible(true)}
					>
						<View className="flex-row w-full items-center justify-center">
							<Text>Logout</Text>
						</View>
					</TouchableOpacity>
				)}

				<UserSettings
					title="Account"
					options={[
						{
							icon: <EmailIcon />,
							label: 'Wallets',
							status: '',
							onPress: () => {},
						},
						{
							icon: <EmailIcon />,
							label: 'Expense categories',
							status: '',
							onPress: () => {},
						},
					]}
				/>

				<UserSettings
					title="Security"
					options={[
						{
							icon: <LockIcon />,
							label: 'PIN',
							status: 'On',
							onPress: () => {},
						},
						{
							icon: <FingerPrintIcon />,
							label: 'Fingerprint',
							status: 'Off',
							onPress: () => {},
						},
					]}
				/>

				<UserSettings
					title="Delete Account"
					options={[
						{
							icon: <DeleteForeverIcon />,
							label: 'Delete Account',
							status: '',
							onPress: () => {},
						},
					]}
				/>
			</View>

			{isConfirmationVisible && (
				<View className="absolute top-0 left-0 right-0 bottom-0 flex-1 justify-center items-center   bg-opacity-50">
					<View className="bg-white p-6 rounded-lg border border-red-200">
						<Text className="text-lg font-sans mb-4 text-center">
							Are you sure you want to log out?
						</Text>
						<View className="flex-row justify-around gap-2">
							<Pressable
								className="border-red-200 border w-1/2 py-3 rounded-md "
								onPress={handleCloseConfirmation}
							>
								<Text className="text-center">No</Text>
							</Pressable>
							<Pressable
								className="bg-red-200 w-1/2 py-3 rounded-md"
								onPress={() => handleLogout()}
							>
								<Text className="text-center">Yes</Text>
							</Pressable>
						</View>
					</View>
				</View>
			)}
		</ScrollView>
	);
}
