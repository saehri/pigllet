import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

import OnboardingSection from '@/src/components/reusables/onboarding-section';
import { useRouter } from 'expo-router';
import { useUserFirstTimeStore } from '@/store/useUserFirstTimeStore';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import * as schema from '@/db/schema';
import { transactionCategories } from '@/constants/expense-category';
import { incomeCategories } from '@/constants/income-category';
import { transferCategories } from '@/constants/transfer-category';

const SECTIONS = [
	{
		title: 'Welcome to Pigllet!',
		description: 'Your simple way to manage money and stay in control.',
	},
	{
		title: 'Track Every Transaction',
		description: 'Record income, expenses and transfer in seconds.',
	},
	{
		title: 'Sort with Categories',
		description: 'Group your spending to see where your money goes.',
	},
	{
		title: 'Never Miss a Payment',
		description: 'Get reminders for upcoming bills and subscriptions.',
	},
	{
		title: 'Stay on Budget',
		description: 'Set limits and track your spending in real time.',
	},
	{
		title: 'Get Started',
		description: 'Let’s set up your account and start tracking.',
	},
];

export default function OnboardingScreen() {
	const theme = useTheme();
	const router = useRouter();

	const [index, setIndex] = useState(0);
	const [isSettingUp, setIsSettingUp] = useState<boolean>(false);

	const { setFirstTimer } = useUserFirstTimeStore();

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
					transactionCategories.map((category) => ({
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

	const nextSection = () => {
		if (index < SECTIONS.length - 1) setIndex(index + 1);
	};

	const prevSection = () => {
		if (index > 0) setIndex(index - 1);
	};

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			<OnboardingSection
				key={index} // key is important for triggering enter/exit
				title={SECTIONS[index].title}
				description={SECTIONS[index].description}
			/>

			<View style={styles.buttons}>
				<Button
					labelStyle={styles.buttonLabel}
					mode="contained-tonal"
					onPress={prevSection}
					disabled={index === 0}
				>
					Previous
				</Button>

				{index !== SECTIONS.length - 1 ? (
					<Button
						labelStyle={styles.buttonLabel}
						mode="contained-tonal"
						onPress={nextSection}
						disabled={index === SECTIONS.length - 1}
					>
						Next
					</Button>
				) : (
					<Button
						mode="contained"
						labelStyle={styles.buttonLabel}
						onPress={setMyApp}
					>
						{isSettingUp ? (
							<ActivityIndicator size={20} color={theme.colors.onPrimary} />
						) : (
							'Go to the next step'
						)}
					</Button>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	buttons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
	},
	buttonLabel: {
		fontFamily: 'Manrope-Medium',
	},
});

