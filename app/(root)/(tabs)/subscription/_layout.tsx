import React from 'react';
import { router, Slot, usePathname } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import AddIcon from '@/assets/svg/add_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';

export default function TabLayout() {
	const pathname = usePathname();

	return (
		<>
			<Slot />

			<TouchableOpacity
				onPress={() => router.push('/create-subscription-form-screen')}
				className={`absolute bottom-6 right-6 w-16 h-16 items-center justify-center bg-[#FF2C4A] rounded-xl ${
					pathname === '/expense/create-expense-screen' ? 'hidden' : ''
				}`}
			>
				<AddIcon />
			</TouchableOpacity>
		</>
	);
}
