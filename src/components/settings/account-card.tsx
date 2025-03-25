import { Image, View } from 'react-native';
import { useContext } from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import * as schema from '@/db/schema';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

interface Props extends schema.Accounts {}

export default function AccountCard({
	name,
	number,
	balance,
	image,
	is_cash,
}: Props) {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	return (
		<Surface
			mode="elevated"
			elevation={4}
			style={{
				flex: 1,
				height: 200,
				borderRadius: 20,
				overflow: 'hidden',
				padding: 20,
				justifyContent: 'space-between',
			}}
		>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={{ fontFamily: 'Inter-Regular' }} variant="headlineSmall">
					{`${currentCurrencySymbol} ${balance.toLocaleString(
						getLocaleByCurrencySymbol(currentCurrencySymbol)
					)}`}
				</Text>
			</View>

			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={{ fontFamily: 'Inter-Regular' }} variant="bodyLarge">
					{name}
				</Text>

				<Text style={{ fontFamily: 'Inter-Regular' }} variant="bodyLarge">
					{number}
				</Text>
			</View>

			<Image
				source={require('@/assets/icons/adaptive-icon.png')}
				style={{
					width: 80,
					height: 80,
					position: 'absolute',
					top: 0,
					right: 0,
					zIndex: 5,
				}}
			/>

			<View
				style={{
					backgroundColor: theme.colors.elevation.level5,
					position: 'absolute',
					top: -100,
					right: -50,
					width: 200,
					height: 200,
					borderRadius: 1000,
				}}
			></View>
		</Surface>
	);
}
