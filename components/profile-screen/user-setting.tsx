import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ArrowRightIcon from '@/assets/svg/arrow/keyboard-arrow-right.svg';

interface UserSettingsProps {
	title: string;
	options: {
		icon: React.ReactNode;
		label: string;
		status?: string;
		onPress: () => void;
	}[];
}

const UserSettings = ({ title, options }: UserSettingsProps) => {
	return (
		<View>
			<Text className="text-lg mb-2">{title}</Text>

			<View className="w-full h-auto bg-white rounded-2xl border border-slate-200">
				{options.map((option, i) => {
					const isLastOption = i === options.length - 1;
					return (
						<TouchableOpacity key={i} onPress={option.onPress}>
							<View
								className={`flex-row justify-between items-center p-4 rounded-lg ${
									!isLastOption ? 'border-b border-slate-200' : ''
								}`}
							>
								<View className="flex-row items-center">
									{option.icon}
									<Text className="ml-3 text-lg text-slate-900 tracking-tight">
										{option.label}
									</Text>
								</View>

								<View className="flex-row items-center ">
									<Text className="text-slate-600 tracking-tight">
										{option.status}
									</Text>
									<ArrowRightIcon />
								</View>
							</View>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
};

export default UserSettings;
