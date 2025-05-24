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

			setFirstTimer(false);

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
						type: 'income',
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

			router.push('/(auth)/account-setup');
		} catch (error) {
			setIsSettingUp(false);
		} finally {
			setIsSettingUp(false);
		}
	}

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			<View style={styles.imageContainer}>
				<Image
					source={require('@/assets/images/welcome image.png')}
					style={styles.image}
				/>
			</View>

			<View style={{ gap: 16 }}>
				<Text variant="headlineLarge" style={styles.headlineLarge}>
					Take control of your finance, now!
				</Text>

				<Text variant="bodyLarge" numberOfLines={2} style={styles.bodyLarge}>
					Pigllet is a next-gen money tracker, but like… cuter, smarter, and
					totally iconic. 💖✨💸
				</Text>
			</View>

			<View style={{ gap: 12 }}>
				<Button
					mode="contained"
					style={styles.button}
					labelStyle={styles.buttonLabel}
					onPress={setMyApp}
				>
					{isSettingUp ? (
						<ActivityIndicator size={20} color={theme.colors.onPrimary} />
					) : (
						'Next'
					)}
				</Button>

				<View>
					<Text variant="labelSmall" style={styles.labelSmall}>
						*Pigllet is an offline first application meaning you can use it
						without internet connection.
					</Text>
					<Text variant="labelSmall" style={styles.labelSmall}>
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
	labelSmall: {
		fontFamily: 'Inter-Regular',
		opacity: 0.6,
		textAlign: 'center',
	},
	button: { borderRadius: 10, padding: 8 },
	buttonLabel: { fontFamily: 'Inter-Medium', fontSize: 16 },
	bodyLarge: { fontFamily: 'Inter-Regular', textAlign: 'center', opacity: 0.8 },
	image: { width: 264, height: 302 },
	headlineLarge: { fontFamily: 'Inter-Black', textAlign: 'center' },
});

