import { View } from 'react-native';

import HomeIcon from '@/assets/svg/tab/home_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import HomeFillIcon from '@/assets/svg/tab/home_24dp_E8EAED_FILL1_wght300_GRAD0_opsz24.svg';
import AnalyticsIcon from '@/assets/svg/tab/analytics_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import AnalyticsFillIcon from '@/assets/svg/tab/analytics_24dp_E8EAED_FILL1_wght300_GRAD0_opsz24.svg';
import AddCircledIcon from '@/assets/svg/tab/add_circle_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import AddCircledFillIcon from '@/assets/svg/tab/add_circle_24dp_E8EAED_FILL1_wght300_GRAD0_opsz24.svg';
import SubscriptionIcon from '@/assets/svg/tab/event_repeat_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import SubsriptionFillIcon from '@/assets/svg/tab/event_repeat_24dp_E8EAED_FILL1_wght300_GRAD0_opsz24.svg';
import AccountIcon from '@/assets/svg/tab/account_circle_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import AccountFillIcon from '@/assets/svg/tab/account_circle_24dp_E8EAED_FILL1_wght300_GRAD0_opsz24.svg';

type IconTypes = 'home' | 'expense' | 'create' | 'subscriptions' | 'profile';

interface BottomTabNavigatorIcon {
	focused: boolean;
	type: IconTypes;
}

const BottomTabNavigatorIcon = ({ type, focused }: BottomTabNavigatorIcon) => {
	const renderIcon = () => {
		switch (type) {
			case 'home':
				return focused ? <HomeFillIcon /> : <HomeIcon />;
			case 'expense':
				return focused ? <AnalyticsFillIcon /> : <AnalyticsIcon />;
			case 'create':
				return focused ? <AddCircledFillIcon /> : <AddCircledIcon />;
			case 'subscriptions':
				return focused ? <SubsriptionFillIcon /> : <SubscriptionIcon />;
			case 'profile':
				return focused ? <AccountFillIcon /> : <AccountIcon />;
			default:
				return null;
		}
	};

	return (
		<View className="items-center justify-center w-12 h-12 rounded-full">
			{type === 'create' ? (
				<View className="w-12 h-12 rounded-full bg-red-200 items-center justify-center">
					{renderIcon()}
				</View>
			) : (
				renderIcon()
			)}
		</View>
	);
};

export default BottomTabNavigatorIcon;
