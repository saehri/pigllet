import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { Image, Keyboard, StyleSheet, ToastAndroid, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	MD3Theme,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import * as schema from '@/db/schema';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function WalletSetupScreen() {
	const theme = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			<View style={styles.imageContainer}>
				<Image
					source={require('@/assets/images/wallet.png')}
					style={{ width: 285, height: 280 }}
				/>
			</View>

			<View style={styles.contentContainer}>
				<Text
					variant="headlineLarge"
					style={{ fontFamily: 'Inter-Black', textAlign: 'center' }}
				>
					Let's set up your wallet
				</Text>

				<Text
					variant="bodyLarge"
					numberOfLines={2}
					style={{
						fontFamily: 'Inter-Regular',
						textAlign: 'center',
						opacity: 0.8,
					}}
				>
					How much cash do you have right now?
				</Text>

				<AddWalletForm theme={theme} />

				<View>
					<Text
						variant="labelSmall"
						style={{
							fontFamily: 'Inter-Regular',
							opacity: 0.6,
							textAlign: 'center',
							marginTop: 16,
						}}
					>
						*Pigllet is an offline first application meaning you can use it
						without internet connection.
					</Text>
					<Text
						variant="labelSmall"
						style={{
							fontFamily: 'Inter-Regular',
							opacity: 0.6,
							textAlign: 'center',
						}}
					>
						**By creating an account you will be able to upload your data to the
						cloud so you can access it on other device.
					</Text>
					<Text
						variant="labelSmall"
						style={{
							fontFamily: 'Inter-Regular',
							opacity: 0.6,
							textAlign: 'center',
						}}
					>
						***You can add more wallet by going to the setting.
					</Text>
				</View>
			</View>
		</View>
	);
}

type AddWalletFormProps = {
	theme: MD3Theme;
};

function AddWalletForm({ theme }: AddWalletFormProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [amount, setAmount] = useState('');

	const router = useRouter();
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	async function setMyWallet() {
		try {
			Keyboard.dismiss();

			if (!amount.length || !Boolean(Number(amount)))
				return ToastAndroid.show(
					'Please enter a valid amount',
					ToastAndroid.SHORT
				);

			setLoading(true);

			await drizzleDb
				.insert(schema.accounts)
				.values({
					name: 'Cash',
					created_at: new Date().toISOString(),
					number: '',
					balance: Number(amount),
					image: '',
				})
				.onConflictDoNothing();
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 1.5);
		}

		router.push('/(root)/(tabs)/home');
	}

	return (
		<View style={{ gap: 16 }}>
			<TextInput inputMode="numeric" value={amount} onChangeText={setAmount} />

			<Button
				onPress={setMyWallet}
				mode="contained"
				style={{ borderRadius: 10 }}
				labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
			>
				{loading ? (
					<ActivityIndicator size={20} color={theme.colors.onPrimary} />
				) : (
					'Set up my wallet'
				)}
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imageContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 24,
		paddingTop: 56,
	},
	contentContainer: {
		padding: 16,
		gap: 16,
	},
});
