import { useTheme } from 'react-native-paper';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import SettingContentButton from '@/src/components/settings/setting-content-button';
import SettingContentWrapper from '@/src/components/settings/setting-content-wrapper';

import { useAppThemeStore } from '@/store/useAppThemeStore';
import { CheckIcon } from 'lucide-react-native';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';
import { currencySymbols } from '@/constants/currency-symbols';
import { getCardPosition } from '@/utils/utils';

export default function Customization() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				padding: 16,
			}}
		>
			<View style={{ gap: 24, paddingBottom: 80 }}>
				<SettingContentWrapper headerTitle="Theme">
					<ThemeSelector />
				</SettingContentWrapper>

				<CurrencySelector />
			</View>
		</ScrollView>
	);
}

function ThemeSelector() {
	const theme = useTheme();
	const { currentAppTheme, setAppTheme } = useAppThemeStore();

	const isDarkTheme = currentAppTheme === 'Dark';

	return (
		<SettingContentButton
			label="Dark theme"
			position="only"
			buttonRight={
				<Pressable
					onPress={() =>
						setAppTheme(currentAppTheme === 'Dark' ? 'Light' : 'Dark')
					}
					style={[
						styles.checkboxButton,
						{
							borderColor: theme.colors.outlineVariant,
							backgroundColor: theme.colors.elevation.level2,
							justifyContent: isDarkTheme ? 'flex-end' : 'flex-start',
						},
					]}
				>
					<View
						style={[
							styles.checkboxButtonIndicator,
							{ backgroundColor: theme.colors.tertiary },
						]}
					></View>
				</Pressable>
			}
		/>
	);
}

function CurrencySelector() {
	const { currentCurrencyCode, setAppCurrencyCode } =
		usePreferredCurrencyStore();

	return (
		<SettingContentWrapper headerTitle="Default Currency Symbol">
			{currencySymbols.map((c, index) => (
				<SettingContentButton
					position={getCardPosition(index, currencySymbols.length)}
					onPress={() => setAppCurrencyCode(c.symbol)}
					label={c.label}
					key={c.code}
					higlight={currentCurrencyCode === c.symbol}
					buttonRight={
						<RightButton selected={currentCurrencyCode === c.symbol} />
					}
				/>
			))}
		</SettingContentWrapper>
	);
}

function RightButton({ selected }: { selected: boolean }) {
	const theme = useTheme();

	return (
		<View>
			<CheckIcon
				style={{ display: selected ? 'flex' : 'none' }}
				size={20}
				color={theme.colors.primary}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	checkboxButton: {
		height: 24,
		width: 60,
		borderWidth: 1,
		borderRadius: 100,
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 3,
	},
	checkboxButtonIndicator: {
		width: 35,
		height: 15,
		borderRadius: 100,
	},
	checkboxSectionTitle: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
		marginBottom: 12,
	},
});

