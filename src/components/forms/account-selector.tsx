import { Dispatch, memo, SetStateAction } from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';

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
				showsHorizontalScrollIndicator={false}
				horizontal
				contentContainerStyle={styles.scrollContent}
			>
				{accounts?.map((account) => {
					const isSelected = selectedAccount.id === account.id;

					return (
						<Pressable
							key={account.id}
							onPress={() => handleSelect(account)}
							style={[
								styles.card,
								{
									borderColor: isSelected
										? '#ff64afff'
										: theme.colors.elevation.level5,
								},
							]}
						>
							<Text style={styles.text}>{account.name}</Text>

							<Text style={styles.text}>
								{formatCurrencyByCode(account.balance, currentCurrencyCode)}
							</Text>

							<Image
								source={require('@/assets/images/cards/default-card-design.png')}
								style={styles.bgImage}
							/>
						</Pressable>
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
	},
	scrollContent: {
		gap: 10,
	},
	card: {
		padding: 8,
		borderRadius: 15,
		height: 80,
		width: 150,
		justifyContent: 'space-between',
		borderWidth: 2,
		overflow: 'hidden',
	},
	text: {
		fontFamily: 'Manrope-Regular',
		color: 'white',
	},
	bgImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: -1,
		width: 150,
		height: 95,
		resizeMode: 'cover',
	},
});

export default memo(AccountSelector);

