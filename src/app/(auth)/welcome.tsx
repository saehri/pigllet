import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Surface,
	Text,
	useTheme,
} from 'react-native-paper';

import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useUserFirstTimeStore } from '@/store/useUserFirstTimeStore';

import * as schema from '@/db/schema';
import { incomeCategories } from '@/constants/income-category';
import { expenseCategories } from '@/constants/expense-category';
import { transferCategories } from '@/constants/transfer-category';

import Animated, { FadeIn } from 'react-native-reanimated';
import { SendHorizontalIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SECTIONS = [
	{
		title: 'Welcome to Pigllet!',
		description: 'Your simple way to manage money and stay in control.',
	},
	{
		title: 'Track every transactions',
		description: 'Record income, expenses and transfer in seconds.',
	},
	{
		title: 'Sort with categories',
		description: 'Group your spending to see where your money goes.',
	},
	{
		title: 'Never miss a payment',
		description: 'Get reminders for upcoming bills and subscriptions.',
	},
	{
		title: 'Stay on budget',
		description: 'Set limits and track your spending in real time.',
	},
	{
		title: 'Get started!',
		description: 'Let’s set up your account and start tracking.',
	},
];

export default function OnboardingScreen() {
	const theme = useTheme();
	const router = useRouter();
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	const [index, setIndex] = useState(0);
	const [isSettingUp, setIsSettingUp] = useState<boolean>(false);

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
						is_default: 1,
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
						is_default: 1,
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
						is_default: 1,
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

	const imageRenderer = () => {
		if (index === 0)
			return (
				<Animated.Image
					key={index}
					entering={FadeIn.duration(350)}
					source={require('@/assets/images/onboarding/0.png')}
					style={styles.image}
				/>
			);

		return (
			<Animated.Image
				key={index}
				entering={FadeIn.duration(350)}
				source={require('@/assets/images/welcome image.png')}
				style={styles.image}
			/>
		);
	};

	return (
		<LinearGradient
			colors={[theme.colors.background, 'transparent']}
			start={{ x: 0.5, y: 0.75 }}
			end={{ x: 0.5, y: 0.5 }}
			style={styles.container}
		>
			{imageRenderer()}

			<View style={styles.textContainer}>
				<Text variant="headlineMedium" style={styles.title}>
					{SECTIONS[index].title}
				</Text>

				<Text variant="bodyLarge" style={styles.desc}>
					{SECTIONS[index].description}
				</Text>

				<Surface
					elevation={5}
					mode="flat"
					style={[
						styles.counter,
						{ backgroundColor: theme.colors.secondaryContainer },
					]}
				>
					<Text
						style={{
							fontFamily: 'Manrope-Regular',
							color: theme.colors.onSecondaryContainer,
						}}
						variant="labelMedium"
					>
						{index + 1}/{SECTIONS.length}
					</Text>
				</Surface>
			</View>
			<View style={styles.buttons}>
				<Button
					mode="contained"
					onPress={prevSection}
					disabled={index === 0 || isSettingUp}
					style={styles.button}
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
				>
					Previous
				</Button>

				{index !== SECTIONS.length - 1 ? (
					<Button
						mode="contained"
						onPress={nextSection}
						style={styles.button}
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						disabled={index === SECTIONS.length - 1 || isSettingUp}
					>
						Next
					</Button>
				) : (
					<Button
						mode="contained"
						onPress={setMyApp}
						style={styles.button}
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						disabled={isSettingUp}
						icon={(props) => (
							<SendHorizontalIcon
								size={20}
								color={props.color}
								strokeWidth={1.5}
							/>
						)}
					>
						{isSettingUp ? (
							<ActivityIndicator size={20} color={theme.colors.onPrimary} />
						) : (
							'Get started'
						)}
					</Button>
				)}
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'flex-end' },
	buttons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 40,
		paddingTop: 0,
	},
	button: { marginTop: 16 },
	buttonContent: {
		flexDirection: 'row-reverse',
	},
	buttonLabel: {
		fontFamily: 'Manrope-Medium',
		fontSize: 16,
	},
	title: {
		fontFamily: 'Manrope-ExtraBold',
		textAlign: 'center',
	},
	desc: {
		textAlign: 'center',
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
		maxWidth: '80%',
		alignSelf: 'center',
	},
	textContainer: {
		padding: 0,
	},
	image: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		zIndex: -1,
		objectFit: 'contain',
	},
	counter: {
		marginTop: 24,
		width: 50,
		height: 30,
		borderRadius: 100,
		alignSelf: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

