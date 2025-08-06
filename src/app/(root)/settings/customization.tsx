import { useContext } from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

import SelectInput from '@/src/components/forms/select-input';
import SettingContentWrapper from '@/src/components/settings/setting-content-wrapper';
import SettingContentButton from '@/src/components/settings/setting-content-button';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import { appThemes } from '@/constants/theme-and-color';

export default function Customization() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				padding: 16,
			}}
		>
			<SettingContentWrapper headerTitle="Theme and color">
				<ThemeSelector />
			</SettingContentWrapper>
		</ScrollView>
	);
}

function ThemeSelector() {
	const { currentAppTheme, setAppTheme } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	return (
		<SelectInput
			data={appThemes}
			handleSelect={setAppTheme}
			value={currentAppTheme}
			closeAfterSelect
			triggerButton={({ showDialog }) => (
				<SettingContentButton
					onPress={showDialog}
					label="Theme"
					buttonRightTitle={currentAppTheme}
				/>
			)}
		/>
	);
}

