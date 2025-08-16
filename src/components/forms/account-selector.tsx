import { Dispatch, memo, SetStateAction } from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import * as schema from '@/db/schema';

import { formatCurrencyByCode } from '@/utils/utils';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

interface AccountSelectorProps {
	accounts: schema.Account[];
	handleSelect: Dispatch<SetStateAction<schema.Account>>;
	selectedAccount: schema.Account;
}

function AccountSelector({
	handleSelect,
	accounts,
	selectedAccount,
}: AccountSelectorProps) {
	const theme = useTheme();
	const currentCurrencyCode = usePreferredCurrencyStore(
		(s) => s.currentCurrencyCode
	);

	return (
		<Surface
			mode="flat"
			elevation={5}
			style={[styles.container, { borderColor: theme.colors.outlineVariant }]}
		>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{accounts?.map((account, index) => {
					const isSelected = selectedAccount.id === account.id;
					const enteringDelay = 300 + index * 100;

					return (
						<Animated.View
							key={account.id}
							entering={FadeInRight.delay(enteringDelay)
								.springify()
								.mass(1)
								.damping(10)
								.stiffness(100)}
						>
							<Pressable
								onPress={() => handleSelect(account)}
								style={[
									styles.card,
									{
										borderColor: isSelected
											? account?.card_color
											: theme.colors.elevation.level5,
									},
								]}
							>
								<View
									style={[
										styles.cardContent,
										{
											backgroundColor: account.card_color,
										},
									]}
								>
									<Text style={styles.text}>{account.card_name}</Text>

									<Text style={styles.text}>
										{formatCurrencyByCode(account.balance, currentCurrencyCode)}
									</Text>

									<Image
										source={require('@/assets/images/cards/pig pattern.png')}
										style={styles.bgImage}
									/>
								</View>
							</Pressable>
						</Animated.View>
					);
				})}
			</ScrollView>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 16,
		borderWidth: 1,
		padding: 10,
		height: 102,
	},
	scrollContent: {
		gap: 10,
	},
	card: {
		padding: 2,
		borderRadius: 14,
		height: 80,
		width: 150,
		justifyContent: 'space-between',
		borderWidth: 2,
		overflow: 'hidden',
	},
	text: {
		fontFamily: 'Manrope-Regular',
		color: 'white',
		zIndex: 2,
	},
	bgImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 0,
		width: 150,
		height: 95,
		resizeMode: 'cover',
	},
	cardContent: {
		justifyContent: 'space-between',
		flex: 1,
		borderRadius: 10,
		padding: 8,
		overflow: 'hidden',
	},
});

export default memo(AccountSelector);

