import React, { useCallback } from 'react';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, ToastAndroid, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Dialog,
	MD3Theme,
	Modal,
	Portal,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import * as schema from '@/db/schema';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import { eq, or } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import { Trash2 } from 'lucide-react-native';

export default function EditAccountScreen() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const theme = useTheme();

	const { accountId } = useLocalSearchParams();

	const [accounts, setAccounts] = useState<schema.Accounts[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);
				const accounts = await drizzleDb
					.select()
					.from(schema.accounts)
					.where(eq(schema.accounts.id, Number(accountId)));

				setAccounts(accounts);
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.CENTER);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, []);

	if (loading) {
		return (
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					height: 300,
				}}
			>
				<ActivityIndicator size={20} color={theme.colors.onSurface} />
			</View>
		);
	}

	if (!accounts.length) return <NoItemNotice />;

	return (
		<ScrollView>
			<Form
				theme={theme}
				drizzleDb={drizzleDb}
				initialFormValue={accounts[0]}
			/>
		</ScrollView>
	);
}

type FormProps = {
	theme: MD3Theme;
	drizzleDb: ExpoSQLiteDatabase<typeof schema> & {
		$client: SQLiteDatabase;
	};
	initialFormValue: schema.Accounts;
};

function Form({ theme, drizzleDb, initialFormValue }: FormProps) {
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const router = useRouter();

	const [formLoading, setFormLoading] = useState<boolean>(false);
	const [accountName, setAccountName] = useState<string>(initialFormValue.name);
	const [accountBalance, setAccountBalance] = useState<string>(
		initialFormValue.balance.toString()
	);
	const [accountNumber, setAccountNumber] = useState<string>(
		initialFormValue.number || ''
	);
	const [accountImage, setAccountImage] = useState<string>('');

	async function editAccount() {
		try {
			setFormLoading(true);
			if (!accountName.length || !accountBalance.length) {
				return ToastAndroid.show('Invalid account data!', ToastAndroid.SHORT);
			}

			await drizzleDb
				.update(schema.accounts)
				.set({
					balance: Number(accountBalance),
					created_at: new Date().toISOString(),
					name: accountName,
					number: accountNumber,
					image: accountImage,
				})
				.where(eq(schema.accounts.id, initialFormValue.id as number));

			ToastAndroid.show('Account successfully created!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show('Failed to add an account', ToastAndroid.SHORT);
		} finally {
			setFormLoading(false);
		}
	}

	async function deleteAccount() {
		try {
			setFormLoading(true);
			await drizzleDb
				.delete(schema.accounts)
				.where(eq(schema.accounts.id, initialFormValue.id as number));

			await drizzleDb
				.delete(schema.transactions)
				.where(
					or(
						eq(schema.transactions.account_id, initialFormValue.id as number),
						eq(
							schema.transactions.related_account_id,
							initialFormValue.id as number
						)
					)
				);

			ToastAndroid.show('Account deleted!', ToastAndroid.CENTER);
			router.back();
		} catch (error) {
			ToastAndroid.show('Error when updating expense', ToastAndroid.CENTER);
		} finally {
			setFormLoading(false);
		}
	}

	return (
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
				onPress={editAccount}
				disabled={!accountBalance.length || !accountName.length}
			>
				{formLoading ? (
					<ActivityIndicator size={20} color={theme.colors.onPrimary} />
				) : (
					'Save changes'
				)}
			</Button>

			{initialFormValue.is_cash !== 1 && (
				<DeleteButton
					formLoading={formLoading}
					handleDelete={deleteAccount}
					theme={theme}
				/>
			)}
		</View>
	);
}

type DeleteButtonProps = {
	theme: MD3Theme;
	formLoading: boolean;
	handleDelete: () => void;
};

function DeleteButton({ theme, formLoading, handleDelete }: DeleteButtonProps) {
	const [visible, setVisible] = useState<boolean>(false);

	const showModal = useCallback(() => setVisible(true), []);
	const hideModal = useCallback(() => setVisible(false), []);

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={hideModal}>
					<Dialog.Title>Delete account</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
							All item records linked to this account will be deleted
							permanently. This action cannot be undone.
						</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button
							labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
							onPress={hideModal}
						>
							Cancel
						</Button>
						<Button
							labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
							onPress={handleDelete}
						>
							Ok
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<Button
				mode="outlined"
				style={{ borderRadius: 10 }}
				labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
				onPress={showModal}
			>
				{formLoading ? (
					<ActivityIndicator size={20} color={theme.colors.onSurface} />
				) : (
					'Delete account'
				)}
			</Button>
		</>
	);
}
