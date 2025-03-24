import { Check } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import SettingContentButtonModal from '@/src/components/settings/setting-content-button';
import SettingContentWrapper from '@/src/components/settings/setting-content-wrapper';

import { currencySymbols } from '@/constants/currency-symbols';
import { useContext } from 'react';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

export default function Currency() {
	const theme = useTheme();

	const { currentCurrencySymbol, setAppCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			<View style={{ gap: 24, padding: 16 }}>
				<SettingContentWrapper headerTitle="Currency symbol">
					{currencySymbols.map((c) => (
						<SettingContentButtonModal
							onPress={() => setAppCurrencySymbol(c.symbol)}
							label={c.label}
							key={c.code}
							higlight={currentCurrencySymbol === c.symbol}
							buttonRight={
								<RightButton selected={currentCurrencySymbol === c.symbol} />
							}
						/>
					))}
				</SettingContentWrapper>
			</View>
		</ScrollView>
	);
}

function RightButton({ selected }: { selected: boolean }) {
	const theme = useTheme();

	return (
		<View>
			<Check
				style={{ display: selected ? 'flex' : 'none' }}
				size={20}
				color={theme.colors.onSurface}
			/>
		</View>
	);
}
