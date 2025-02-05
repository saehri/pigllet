import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import HeaderTabButton from './header-tab-button';

type Tab = {
	selectedTab: string;
	setSelectedTab: Dispatch<SetStateAction<string>>;
	label: string;
	text: string;
};

interface TopTabNavigation {
	tabs: Tab[];
}

export default function TopTabNavigation({ tabs }: TopTabNavigation) {
	return (
		<View className="relative flex-row justify-between border border-red-100 p-1 rounded-xl mb-8 bg-slate-100 mx-6">
			{tabs.map((tab) => (
				<HeaderTabButton
					key={tab.label}
					label={tab.label}
					text={tab.text}
					selectedTab={tab.selectedTab}
					setSelectedTab={tab.setSelectedTab}
				/>
			))}
		</View>
	);
}
