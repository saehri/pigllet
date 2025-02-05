import ChevronLeftIcon from '@/assets/svg/arrow/chevron_left_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

interface ScreenBackButton {
	screenName: string;
}

export default function ScreenBackButton(props: ScreenBackButton) {
	const router = useRouter();

	return (
		<View className="px-6 mb-12 relative">
			<TouchableOpacity
				onPress={() => router.back()}
				className="flex-row items-center w-20 relative z-20"
			>
				<ChevronLeftIcon />
				<Text>Back</Text>
			</TouchableOpacity>

			<Text className="absolute left-6 z-10 text-center w-full font-bold text-xl tracking-tight text-[#FF2C4A]">
				{props.screenName}
			</Text>
		</View>
	);
}
