import { Image, Pressable, View } from 'react-native';
import { useContext } from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import * as schema from '@/db/schema';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import { useRouter } from 'expo-router';

interface Props extends schema.Accounts {
	compact?: boolean;
	clickable?: boolean;
}

export default function AccountCard({
	name,
	number,
	balance,
	image,
	is_cash,
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
					flex: 1,
					height: compact ? 120 : 200,
					borderRadius: 20,
					overflow: 'hidden',
					padding: 20,
					justifyContent: 'space-between',
				}}
			>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text
						style={{ fontFamily: 'Inter-Regular' }}
						variant={compact ? 'bodyLarge' : 'headlineSmall'}
					>
						{`${currentCurrencySymbol} ${balance.toLocaleString(
							getLocaleByCurrencySymbol(currentCurrencySymbol)
						)}`}
					</Text>
				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text
						style={{ fontFamily: 'Inter-Regular' }}
						variant={compact ? 'bodyMedium' : 'bodyLarge'}
					>
						{name}
					</Text>

					<Text
						style={{ fontFamily: 'Inter-Regular' }}
						variant={compact ? 'bodyMedium' : 'bodyLarge'}
					>
						{number}
					</Text>
				</View>

				<Image
					source={require('@/assets/icons/adaptive-icon.png')}
					style={{
						width: compact ? 60 : 80,
						height: compact ? 60 : 80,
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
						zIndex: -1,
					}}
				></View>
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
					flex: 1,
					height: compact ? 120 : 200,
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
						zIndex: -1,
					}}
				></View>
			</Surface>
		</Pressable>
	);
}
