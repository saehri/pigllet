import { Dialog, Portal, Text, useTheme } from 'react-native-paper';
import * as schema from '@/db/schema';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Check, CheckCircle, ChevronDown } from 'lucide-react-native';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';

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

	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

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
							<View>
								{accounts.map((c) => (
									<Pressable
										key={c.id}
										style={{
											padding: 16,
											borderRadius: 20,
											backgroundColor:
												c.id === selectedAccount.id
													? theme.colors.elevation.level5
													: theme.colors.elevation.level3,
										}}
										onPress={() => selectItem(c)}
									>
										<Text
											variant="bodyLarge"
											style={{ fontFamily: 'Inter-Regular' }}
										>
											{c.name}
										</Text>

										<Text
											variant="bodyLarge"
											style={{ fontFamily: 'Inter-Regular' }}
										>
											{`${currentCurrencySymbol} ${c.balance.toLocaleString(
												getLocaleByCurrencySymbol(currentCurrencySymbol)
											)}`}
										</Text>

										{c.id === selectedAccount.id && (
											<CheckCircle
												size={18}
												color={theme.colors.onSurface}
												style={{ position: 'absolute', right: 16, top: 16 }}
											/>
										)}
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
