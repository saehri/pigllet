import React from 'react';
import { useState } from 'react';
import { Dialog, MD3Theme, Portal, Text, useTheme } from 'react-native-paper';
import { Pressable, ScrollView, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import * as schema from '@/db/schema';

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

	if (!accounts.length || !selectedAccount) {
		return (
			<DialogTrigger
				dialogVisible={visible}
				selectedAccountName={''}
				showDialog={showDialog}
				theme={theme}
			/>
		);
	}

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={hideDialog}>
					<Dialog.Content>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={{ gap: 12 }}>
								{accounts.map((account) => (
									<Pressable
										key={account.id}
										style={{
											borderRadius: 20,
											backgroundColor:
												account.id === selectedAccount?.id
													? theme.colors.elevation.level5
													: theme.colors.elevation.level3,
											borderWidth: 1,
											borderColor:
												account.id === selectedAccount.id
													? theme.colors.primary
													: theme.colors.elevation.level3,
										}}
										onPress={() => selectItem(account)}
									>
										<AccountCard
											balance={account.balance}
											created_at={account.created_at}
											name={account.name}
											number={account.number}
											image={account.image}
											id={account.id}
											is_cash={account.is_cash}
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

			<DialogTrigger
				dialogVisible={visible}
				selectedAccountName={selectedAccount.name}
				showDialog={showDialog}
				theme={theme}
			/>
		</>
	);
}

type DialogTriggerProps = {
	showDialog: () => void;
	theme: MD3Theme;
	dialogVisible: boolean;
	selectedAccountName: string;
};

function DialogTrigger({
	dialogVisible,
	selectedAccountName,
	showDialog,
	theme,
}: DialogTriggerProps) {
	return (
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
				borderColor: dialogVisible
					? theme.colors.primary
					: theme.colors.outline,
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
				{selectedAccountName}
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
	);
}
