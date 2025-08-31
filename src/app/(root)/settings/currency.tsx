import { Check } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { ScrollView, View } from 'react-native';

import SettingContentButton from '@/src/components/settings/setting-content-button';
import SettingContentWrapper from '@/src/components/settings/setting-content-wrapper';

import { currencySymbols } from '@/constants/currency-symbols';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';

export default function Currency() {
	const theme = useTheme();

	const { currentCurrencyCode, setAppCurrencyCode } = useCurrencyStyle();

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			<View style={{ gap: 24, padding: 16 }}>
				<SettingContentWrapper headerTitle="Currency symbol">
					{currencySymbols.map((c) => (
						<SettingContentButton
							position="only"
							onPress={() => setAppCurrencyCode(c.code)}
							label={c.label}
							key={c.code}
							higlight={currentCurrencyCode === c.symbol}
							buttonRight={
								<RightButton selected={currentCurrencyCode === c.symbol} />
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
				color={theme.colors.primary}
			/>
		</View>
	);
}

