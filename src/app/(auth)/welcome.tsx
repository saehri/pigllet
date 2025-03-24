import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';

import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import { expenseCategories } from '@/constants/expense-category';
import { incomeCategories } from '@/constants/income-category';
import { transferCategories } from '@/constants/transfer-category';

export default function WelcomeScreen() {
	const theme = useTheme();
	const router = useRouter();

	const [isSettingUp, setIsSettingUp] = useState<boolean>(false);

	const { setFirstTimer } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	async function setMyApp() {
		try {
			setIsSettingUp(true);
			const createdAt = new Date().toISOString();

			// Insert default expense categories
			await drizzleDb
				.insert(schema.categories)
				.values(
					expenseCategories.map((category) => ({
						type: 'expense',
						label: category.label, // Use category name
						icon_name: category.icon, // Use icon name
						budget_id: null, // If budget_id is optional, set it to null
						created_at: createdAt, // Set the timestamp
					}))
				)
				.onConflictDoNothing();

			await drizzleDb
				.insert(schema.categories)
				.values(
					incomeCategories.map((category) => ({
						label: category.label,
						icon_name: category.icon,
						created_at: createdAt,
						type: 'incomes',
					}))
				)
				.onConflictDoNothing();

			await drizzleDb
				.insert(schema.categories)
				.values(
					transferCategories.map((category) => ({
						label: category.label,
						icon_name: category.icon,
						created_at: createdAt,
						type: 'transfer',
					}))
				)
				.onConflictDoNothing();
		} catch (error) {
			setIsSettingUp(false);
		} finally {
			setTimeout(() => {
				setIsSettingUp(false);
			}, 1500);
		}

		setFirstTimer(false);
		router.push('/(auth)/wallet-setup');
	}

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			<View style={styles.imageContainer}>
				<Image
					source={require('@/assets/images/welcome image.png')}
					style={{ width: 264, height: 302 }}
				/>
			</View>

			<View style={{ gap: 16 }}>
				<Text
					variant="headlineLarge"
					style={{ fontFamily: 'Inter-Black', textAlign: 'center' }}
				>
					Take control of your finance, now!
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
					Pigllet is a next-gen money tracker, but like… cuter, smarter, and
					totally iconic. 💖✨💸
				</Text>
			</View>

			<View style={{ gap: 12 }}>
				<Button
					mode="contained"
					style={{ borderRadius: 10 }}
					labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
					onPress={setMyApp}
				>
					{isSettingUp ? (
						<ActivityIndicator size={20} color={theme.colors.onPrimary} />
					) : (
						'Next'
					)}
				</Button>

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
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		paddingVertical: 36,
		justifyContent: 'flex-end',
		gap: 36,
	},
	imageContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
});
