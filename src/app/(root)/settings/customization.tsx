import { useTheme } from 'react-native-paper';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import SettingContentButton from '@/src/components/settings/setting-content-button';
import SettingContentWrapper from '@/src/components/settings/setting-content-wrapper';

import { useAppThemeStore } from '@/store/useAppThemeStore';
import { CheckIcon } from 'lucide-react-native';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';
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

				<SettingContentWrapper headerTitle="Currency appearance">
					<CurrencyAccountingStyle />
					<CurrencyFractionStyle />
					<CurrencySuffix />
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

function CurrencyAccountingStyle() {
	const theme = useTheme();
	const { accountingStyle, setAccountingStyle } = useCurrencyStyle();

	return (
		<SettingContentButton
			label="Use accounting style"
			description="When enabled, for certain currencies negative values are shown in parentheses instead of using a minus sign.
"
			position="first"
			buttonRight={
				<Pressable
					onPress={() => setAccountingStyle(!accountingStyle)}
					style={[
						styles.checkboxButton,
						{
							borderColor: theme.colors.outlineVariant,
							backgroundColor: theme.colors.elevation.level2,
							justifyContent: accountingStyle ? 'flex-end' : 'flex-start',
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

function CurrencyFractionStyle() {
	const theme = useTheme();
	const { showFraction, setShowFraction } = useCurrencyStyle();

	return (
		<SettingContentButton
			label="Show fraction digit"
			description="Show decimal place after the number."
			position="middle"
			buttonRight={
				<Pressable
					onPress={() => setShowFraction(!showFraction)}
					style={[
						styles.checkboxButton,
						{
							borderColor: theme.colors.outlineVariant,
							backgroundColor: theme.colors.elevation.level2,
							justifyContent: showFraction ? 'flex-end' : 'flex-start',
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

function CurrencySuffix() {
	const theme = useTheme();
	const { showSuffix, setShowSufix } = useCurrencyStyle();

	return (
		<SettingContentButton
			label="Show suffix for large number"
			description="When this is on, large numbers will be shortened with suffixes (for example, 1,200 becomes 1.2K, 1,000,000 becomes 1M)."
			position="last"
			buttonRight={
				<Pressable
					onPress={() => setShowSufix(!showSuffix)}
					style={[
						styles.checkboxButton,
						{
							borderColor: theme.colors.outlineVariant,
							backgroundColor: theme.colors.elevation.level2,
							justifyContent: showSuffix ? 'flex-end' : 'flex-start',
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
	const { currentCurrencyCode, setAppCurrencyCode } = useCurrencyStyle();

	return (
		<SettingContentWrapper headerTitle="Default currency symbol">
			{currencySymbols.map((c, index) => (
				<SettingContentButton
					position={getCardPosition(index, currencySymbols.length)}
					onPress={() => setAppCurrencyCode(c.code)}
					label={c.label}
					key={c.code}
					higlight={currentCurrencyCode === c.code}
					buttonRight={
						<RightButton selected={currentCurrencyCode === c.code} />
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
				color={theme.colors.onSurface}
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

