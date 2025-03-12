import { useState } from 'react';
import { useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';

import SelectInput from '@/src/components/forms/select-input';
import SettingContentWrapper from '@/src/components/settings/setting-content-wrapper';
import SettingContentButtonModal from '@/src/components/settings/setting-content-button';

export default function Customization() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				padding: 16,
			}}
		>
			<SettingContentWrapper headerTitle="Color and theme">
				<ColorSelector />
				<ThemeSelector />
			</SettingContentWrapper>
		</ScrollView>
	);
}

function ColorSelector() {
	const [selectedColor, setSelectedColor] = useState('default');

	const colors = [
		{ label: 'Default', value: 'default' },
		{ label: 'Emerald', value: 'emerald' },
		{ label: 'Onyx', value: 'onyx' },
	];

	return (
		<SelectInput
			data={colors}
			handleSelect={setSelectedColor}
			value={selectedColor}
			closeAfterSelect
			triggerButton={({ showDialog }) => (
				<SettingContentButtonModal
					onPress={showDialog}
					label="App color"
					buttonRightTitle={
						colors.filter((t) => t.value === selectedColor)[0].label
					}
				/>
			)}
		/>
	);
}

function ThemeSelector() {
	const [selectedTheme, setSelectedTheme] = useState('device');

	const themes = [
		{ label: 'Device theme', value: 'device' },
		{ label: 'Dark', value: 'dark' },
		{ label: 'Light', value: 'light' },
	];

	return (
		<SelectInput
			data={themes}
			handleSelect={setSelectedTheme}
			value={selectedTheme}
			closeAfterSelect
			triggerButton={({ showDialog }) => (
				<SettingContentButtonModal
					onPress={showDialog}
					label="Theme"
					buttonRightTitle={
						themes.filter((t) => t.value === selectedTheme)[0].label
					}
				/>
			)}
		/>
	);
}
