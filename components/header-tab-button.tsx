import { Text, Pressable } from 'react-native';
import React from 'react';

interface HeaderTabButtonProps {
	label: string;
	text: string;
	selectedTab: string;
	setSelectedTab: (tab: string) => void;
}

const HeaderTabButton = ({
	label,
	text,
	selectedTab,
	setSelectedTab,
}: HeaderTabButtonProps) => {
	return (
		<Pressable
			className={`justify-center py-2 rounded-lg flex-1 items-center ${
				selectedTab === label
					? 'bg-[#FF4863] border border-[#FF6A83]'
					: 'border-transparent'
			}`}
			onPress={() => setSelectedTab(label)}
		>
			<Text
				className={`text-center tracking-tight text-lg ${
					selectedTab === label ? 'text-white' : 'text-slate-900'
				}`}
			>
				{text}
			</Text>
		</Pressable>
	);
};

export default HeaderTabButton;
