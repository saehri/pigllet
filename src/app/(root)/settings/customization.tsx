import { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import SelectInput from '@/src/components/forms/select-input';
import SettingContentWrapper from '@/src/components/settings/setting-content-wrapper';
import SettingContentButtonModal from '@/src/components/settings/setting-content-button';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import { appThemes, appColors } from '@/constants/theme-and-color';

export default function Customization() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				padding: 16,
			}}
		>
			<View style={{ gap: 24 }}>
				<SettingContentWrapper headerTitle="Theme and color">
					<ThemeSelector />
					<ColorSelector />
				</SettingContentWrapper>

				<SettingContentWrapper headerTitle="Other">
					<SettingContentButtonModal
						label="Language (Coming soon)"
						buttonRightTitle="English"
					/>
					<SettingContentButtonModal
						label="Wallpaper (Coming soon)"
						buttonRightTitle="Default"
					/>
					<SettingContentButtonModal
						label="Reduce motion (Coming soon)"
						buttonRightTitle="Off"
					/>
				</SettingContentWrapper>
			</View>
		</ScrollView>
	);
}

function ColorSelector() {
	const { setAppColor, currentAppColor } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	return (
		<SelectInput
			data={appColors}
			handleSelect={setAppColor}
			value={currentAppColor}
			closeAfterSelect
			triggerButton={({ showDialog }) => (
				<SettingContentButtonModal
					onPress={showDialog}
					label="App color"
					buttonRightTitle={currentAppColor}
				/>
			)}
		/>
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
				<SettingContentButtonModal
					onPress={showDialog}
					label="Theme"
					buttonRightTitle={currentAppTheme}
				/>
			)}
		/>
	);
}
