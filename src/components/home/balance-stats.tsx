import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

type Props = {
	balance: number;
};

export default function BalanceStats({ balance }: Props) {
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	return (
		<View>
			<Text variant="bodyMedium" style={styles.title}>
				Your balance
			</Text>
			<Text variant="headlineLarge" style={styles.mainText}>
				{`${currentCurrencySymbol} ${balance.toLocaleString(
					getLocaleByCurrencySymbol(currentCurrencySymbol)
				)}`}
			</Text>

			<Text variant="labelSmall" style={styles.caption}>
				This is the total balance across all your accounts.
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontFamily: 'Inter-Regular',
		opacity: 0.8,
	},
	mainText: {
		fontFamily: 'Inter-Regular',
	},
	caption: {
		fontFamily: 'Inter-Light',
		opacity: 0.8,
		marginTop: 10,
	},
});
