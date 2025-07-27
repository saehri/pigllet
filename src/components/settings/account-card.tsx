import { Dimensions, Image, Pressable, View } from 'react-native';
import { useContext } from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import * as schema from '@/db/schema';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import { useRouter } from 'expo-router';

interface Props extends schema.Account {
	compact?: boolean;
	clickable?: boolean;
}

export default function AccountCard({
	name,
	number,
	balance,
	id,
	compact,
	clickable,
}: Props) {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const router = useRouter();

	if (!clickable)
		return (
			<Surface
				mode="elevated"
				elevation={4}
				style={{
					height: compact ? 150 : 200,
					borderRadius: 16,
					overflow: 'hidden',
					padding: 8,
					paddingHorizontal: 25,
					justifyContent: 'flex-end',
					flexDirection: 'column',
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginBottom: 6,
					}}
				>
					{number.match(/.{1,4}/g)?.map((t) => (
						<Text
							key={t}
							style={{ fontFamily: 'Manrope-Regular' }}
							variant="bodySmall"
						>
							{t}
						</Text>
					))}
				</View>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<Text style={{ fontFamily: 'Manrope-Regular' }} variant="bodySmall">
						{name}
					</Text>

					<Text style={{ fontFamily: 'Manrope-Regular' }} variant="bodySmall">
						{`${currentCurrencySymbol} ${balance.toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}`}
					</Text>
				</View>

				<Image
					source={require('@/assets/images/cards/default-card-design.png')}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: -1,
						width: Dimensions.get('screen').width - 100,
						height: 150,
					}}
				/>
			</Surface>
		);

	return (
		<Pressable
			onPress={() =>
				router.push({
					pathname: '/settings/accounts/edit-account',
					params: { accountId: id },
				})
			}
		>
			<Surface
				mode="elevated"
				elevation={4}
				style={{
					height: compact ? 120 : 200,
					borderRadius: 16,
					overflow: 'hidden',
					padding: 16,
					paddingHorizontal: 30,
					justifyContent: 'flex-end',
					flexDirection: 'column',
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginBottom: 4,
					}}
				>
					{number.match(/.{1,4}/g)?.map((t) => (
						<Text
							key={t}
							style={{ fontFamily: 'Manrope-Regular' }}
							variant="bodyLarge"
						>
							{t}
						</Text>
					))}
				</View>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<Text style={{ fontFamily: 'Manrope-Regular' }} variant="bodyLarge">
						{name}
					</Text>

					<Text style={{ fontFamily: 'Manrope-Regular' }} variant="bodyLarge">
						{`${currentCurrencySymbol} ${balance.toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}`}
					</Text>
				</View>

				<Image
					source={require('@/assets/images/cards/default-card-design.png')}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						zIndex: -1,
						width: Dimensions.get('screen').width - 32,
						height: 200,
					}}
				/>
			</Surface>
		</Pressable>
	);
}

