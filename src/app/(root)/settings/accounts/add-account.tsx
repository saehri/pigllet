import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useContext, useState } from 'react';
import { ScrollView, ToastAndroid, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import * as schema from '@/db/schema';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

export default function AddAccountScreen() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const theme = useTheme();

	const [formLoading, setFormLoading] = useState<boolean>(false);
	const [accountName, setAccountName] = useState<string>('');
	const [accountBalance, setAccountBalance] = useState<string>('');
	const [accountNumber, setAccountNumber] = useState<string>('');
	const [accountImage, setAccountImage] = useState<string>('');

	async function createAccount() {
		try {
			setFormLoading(true);
			if (!accountName.length || !accountBalance.length) {
				return ToastAndroid.show('Invalid account data!', ToastAndroid.SHORT);
			}

			await drizzleDb.insert(schema.accounts).values({
				balance: Number(accountBalance),
				created_at: new Date().toISOString(),
				name: accountName,
				number: accountNumber,
				is_cash: 0,
				image: accountImage,
			});

			ToastAndroid.show('Account successfully created!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show('Failed to add an account', ToastAndroid.SHORT);
		} finally {
			setFormLoading(false);
		}
	}

	return (
		<ScrollView>
			<View style={{ padding: 16, gap: 16 }}>
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<View style={{ gap: 8, flex: 1 }}>
						<Text variant="bodyLarge">Account name</Text>
						<TextInput
							keyboardType="default"
							onChangeText={setAccountName}
							value={accountName}
						/>
					</View>

					<View style={{ gap: 8, flex: 1 }}>
						<Text variant="bodyLarge">
							Account balance ({currentCurrencySymbol})
						</Text>
						<TextInput
							keyboardType="number-pad"
							onChangeText={setAccountBalance}
							value={accountBalance}
						/>
					</View>
				</View>

				<View style={{ gap: 8 }}>
					<Text variant="bodyLarge">Account number</Text>
					<TextInput
						keyboardType="default"
						onChangeText={setAccountNumber}
						value={accountNumber}
					/>
				</View>

				<Button
					mode="contained"
					style={{ borderRadius: 10, marginTop: 16 }}
					labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
					onPress={createAccount}
					disabled={!accountBalance.length || !accountName.length}
				>
					{formLoading ? (
						<ActivityIndicator size={20} color={theme.colors.onPrimary} />
					) : (
						'Add account'
					)}
				</Button>
			</View>
		</ScrollView>
	);
}
