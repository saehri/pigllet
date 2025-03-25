import React from 'react';
import { Dialog, Portal, Text, useTheme } from 'react-native-paper';
import * as schema from '@/db/schema';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
<<<<<<< HEAD
import { ChevronDown } from 'lucide-react-native';
=======
import { CheckCircle, ChevronDown } from 'lucide-react-native';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';
>>>>>>> 72dce75984ad184115573262f2eb3a594db1ca3b
import AccountCard from '../settings/account-card';

interface AccountSelector {
	accounts: schema.Accounts[];
	selectedAccount: schema.Accounts;
	handleSelect: (selected: schema.Accounts) => void;
}

export default function AccountSelector({
	accounts,
	handleSelect,
	selectedAccount,
}: AccountSelector) {
	const theme = useTheme();
	const [visible, setVisible] = useState<boolean>(false);

	const showDialog = () => setVisible(true);
	const hideDialog = () => setVisible(false);

	function selectItem(selected: schema.Accounts) {
		handleSelect(selected);
		hideDialog();
	}

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={hideDialog}>
					<Dialog.Content>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={{ gap: 12 }}>
								{accounts.map((c) => (
									<Pressable
										key={c.id}
										style={{
											borderRadius: 20,
											backgroundColor:
												c.id === selectedAccount.id
													? theme.colors.elevation.level5
													: theme.colors.elevation.level3,
											borderWidth: 1,
											borderColor:
												c.id === selectedAccount.id
													? theme.colors.primary
													: theme.colors.elevation.level3,
											opacity: c.id === selectedAccount.id ? 1 : 0.5,
										}}
										onPress={() => selectItem(c)}
									>
										<AccountCard
											balance={c.balance}
											created_at={c.created_at}
											name={c.name}
											number={c.number}
											image={c.image}
											id={c.id}
											is_cash={c.is_cash}
											compact
											clickable={false}
										/>
									</Pressable>
								))}
							</View>
						</ScrollView>
					</Dialog.Content>
				</Dialog>
			</Portal>

			<Pressable
				onPress={showDialog}
				style={{
					padding: 16,
					borderTopLeftRadius: 5,
					borderTopRightRadius: 5,
					borderBottomWidth: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					backgroundColor: theme.colors.surfaceVariant,
					borderColor: visible ? theme.colors.primary : theme.colors.outline,
				}}
			>
				<Text
					style={{
						fontFamily: 'Inter-Regular',
						fontSize: 16,
						color: '#fff',
						textTransform: 'capitalize',
					}}
					numberOfLines={1}
				>
					{selectedAccount.name}
				</Text>

				<ChevronDown
					style={{
						position: 'absolute',
						right: 8,
					}}
					size={20}
					color={theme.colors.onSurface}
				/>
			</Pressable>
		</>
	);
}
