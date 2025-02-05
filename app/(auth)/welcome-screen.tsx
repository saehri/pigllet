import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import Swiper from 'react-native-swiper';

import CustomButton from '@/components/buttons/custom-button';

import Image1 from '@/assets/images/bust-2.png';
import Image3 from '@/assets/images/peep-78.png';
import { SafeAreaView } from 'react-native-safe-area-context';

type OnboardningSlide = {
	id: number;
	title: string;
	description: string;
	image: any;
};

const onboardingContent: OnboardningSlide[] = [
	{
		id: 1,
		title: 'Your hassle free financial manager is a few tap away!',
		description: 'Pigllet is an easy to use financial tracker',
		image: Image1,
	},
	{
		id: 2,
		title: 'Your hassle free financial manager is a few tap away!',
		description: 'Signup now to take control of your money!',
		image: Image3,
	},
];

export default function WelcomeScreen() {
	const swiperRef = useRef<Swiper>(null);
	const [activeIndex, setActiveIndex] = useState<number>(0);

	return (
		<SafeAreaView>
			<View className="h-full pb-32 justify-between bg-white">
				<TouchableOpacity
					onPress={() => router.replace('/(root)/(tabs)/home-screen')}
					className="w-20 h-10 self-end items-center justify-center m-6"
				>
					<Text className="text-slate-900">Skip</Text>
				</TouchableOpacity>

				<Swiper
					loop={true}
					ref={swiperRef}
					index={activeIndex}
					dot={
						<View className="w-[32px] h-[4px] mx-1 bg-slate-200 rounded-full" />
					}
					activeDot={
						<View className="w-[32px] h-[4px] mx-1 bg-[#FF4863] rounded-full" />
					}
				>
					{onboardingContent.map((item) => (
						<View
							key={item.id}
							className="flex-1 p-6 pb-16 items-center justify-end"
						>
							<Image
								className="w-80 h-96"
								source={item.image}
								resizeMode="contain"
							/>

							<Text className="text-[#FF4863] text-4xl text-center leading-[32px] tracking-tighter font-bold mb-2">
								{item.title}
							</Text>

							<Text className="text-center text-slate-900 text-xl tracking-tight">
								{item.description}
							</Text>
						</View>
					))}
				</Swiper>

				<View className="px-6">
					<CustomButton
						text="Create an account"
						type="main"
						onPress={() => router.replace('/(auth)/register-screen')}
					/>

					<Text style={{ fontFamily: 'Geist-Regular' }} className="">
						You can log in to your account to hide this page
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
