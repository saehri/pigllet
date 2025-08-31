import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { ScrollView, ToastAndroid, View } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';

import { useAppThemeStore } from '@/store/useAppThemeStore';
import { useUserFirstTimeStore } from '@/store/useUserFirstTimeStore';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import SettingContentButton from '@/src/components/settings/setting-content-button';
import SettingContentWrapper from '@/src/components/settings/setting-content-wrapper';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

export default function AccountSettingScreen() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background, padding: 16 }}
		>
			<View style={{ gap: 24 }}>
				<ResetUserPreference />
			</View>
		</ScrollView>
	);
}

function ResetUserPreference() {
	const router = useRouter();
	const [visible, setVisible] = useState(false);

	const showDialog = () => setVisible(true);
	const hideDialog = () => setVisible(false);

	const drizzleDb = useDrizzleDB();

	const setAppCurrencyCode = usePreferredCurrencyStore(
		(s) => s.setAppCurrencyCode
	);
	const { setAppTheme } = useAppThemeStore();
	const { setFirstTimer } = useUserFirstTimeStore();

	async function resetUserData() {
		try {
			setAppCurrencyCode('IDR');
			setAppTheme('Dark');
			setFirstTimer(true);

			await drizzleDb.delete(schema.accounts);
			await drizzleDb.delete(schema.budgets);
			await drizzleDb.delete(schema.categories);
			await drizzleDb.delete(schema.transactions);

			hideDialog();

			ToastAndroid.show(
				'Your data deleted successfully! Redirecting you to the welcome page',
				ToastAndroid.SHORT
			);
			setTimeout(() => {
				router.push('/(auth)/welcome');
			}, 1500);
		} catch (error: any) {
			ToastAndroid.show('Failed to delete your data', ToastAndroid.SHORT);
		}
	}

	return (
		<>
			<SettingContentWrapper headerTitle="Danger area">
				<SettingContentButton
					label="Delete my data"
					description="Delete all your saved data in this app"
					labelStyle={{ color: '#ff0000' }}
					buttonRight={
						<ChevronRight strokeWidth={1.5} size={20} color={'#ff0000'} />
					}
					onPress={showDialog}
					position="only"
				/>
			</SettingContentWrapper>

			<Portal>
				<Dialog visible={visible} onDismiss={hideDialog}>
					<Dialog.Title style={{ fontFamily: 'Manrope-Regular' }}>
						Warning
					</Dialog.Title>

					<Dialog.Content>
						<Text variant="bodyLarge" style={{ fontFamily: 'Manrope-Regular' }}>
							This will erase all your data, giving you a fresh start. This
							action cannot be undone.
						</Text>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={hideDialog}
							labelStyle={{ fontFamily: 'Manrope-Regular', fontSize: 16 }}
						>
							Cancel
						</Button>

						<Button
							onPress={resetUserData}
							labelStyle={{ fontFamily: 'Manrope-Regular', fontSize: 16 }}
						>
							Ok
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
}

