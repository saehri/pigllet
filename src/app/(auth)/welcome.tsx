import { useState } from 'react';
import {
	Dimensions,
	Image,
	ImageSourcePropType,
	StyleSheet,
	View,
} from 'react-native';
import { Marquee } from '@animatereactnative/marquee';
import Animated, {
	FadeIn,
	FadeOut,
	interpolate,
	runOnJS,
	SharedValue,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';
import { Button, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import * as schema from '@/db/schema';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';
import { expenseCategories } from '@/constants/expense-category';
import { incomeCategories } from '@/constants/income-category';
import { transferCategories } from '@/constants/transfer-category';
import { useRouter } from 'expo-router';

const images: ImageSourcePropType[] = [
	require('@/assets/images/onboarding/1.jpeg'),
	require('@/assets/images/onboarding/2.jpeg'),
	require('@/assets/images/onboarding/3.jpeg'),
	require('@/assets/images/onboarding/4.jpeg'),
	require('@/assets/images/onboarding/5.jpeg'),
];

const { width } = Dimensions.get('screen');
const _itemWidth = width * 0.62;
const _itemHeight = _itemWidth * 2.22;
const _spacing = 16;
const _itemSize = _itemWidth + _spacing;

type ItemProps = {
	image: ImageSourcePropType;
	index: number;
	offset: SharedValue<number>;
};

function Item({ image, index, offset }: ItemProps) {
	const _styles = useAnimatedStyle(() => {
		const itemPosition = index * _itemSize - width - _itemSize / 2;
		const totalSize = images.length * _itemSize;

		const range =
			((itemPosition - (offset.value + totalSize * 1000)) % totalSize) +
			width +
			_itemSize / 2;

		return {
			transform: [
				{
					rotate: `${interpolate(range, [-_itemSize, (width - _itemSize) / 2, width], [-3, 0, 3])}deg`,
				},
			],
		};
	});

	return (
		<Animated.View
			style={[
				{
					width: _itemWidth,
					height: _itemHeight,
					borderRadius: 16,
				},
				_styles,
			]}
		>
			<Image
				source={image}
				style={{
					flex: 1,
					borderRadius: 16,
					width: '100%',
					height: '100%',
				}}
			/>
		</Animated.View>
	);
}

export default function WelcomeScreen() {
	const theme = useTheme();
	const router = useRouter();
	const drizzleDb = useDrizzleDB();
	const offset = useSharedValue(0);

	const [activeIndex, setActiveIndex] = useState(0);
	const [isSettingUp, setIsSettingUp] = useState(false);

	useAnimatedReaction(
		() => {
			const floatIndex = (offset.value / _itemSize) % images.length;
			return Math.abs(Math.floor(floatIndex));
		},
		(value) => {
			runOnJS(setActiveIndex)(value);
		}
	);

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

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<View style={[StyleSheet.absoluteFillObject]}>
				<Animated.Image
					key={activeIndex}
					entering={FadeIn.duration(1000)}
					exiting={FadeOut.duration(1000)}
					source={images[activeIndex]}
					style={{ flex: 1, width: '100%', height: '100%', opacity: 0.8 }}
					blurRadius={50}
				/>
			</View>

			<Marquee spacing={_spacing} position={offset}>
				<View
					style={{
						flexDirection: 'row',
						gap: _spacing,
					}}
				>
					{images.map((image, index) => (
						<Item
							key={`image-${index}`}
							image={image}
							index={index}
							offset={offset}
						/>
					))}
				</View>
			</Marquee>

			<View
				style={{
					padding: 16,
					paddingBottom: 48,
					width: '100%',
					marginTop: 18,
					gap: 10,
					justifyContent: 'flex-end',
				}}
			>
				<View style={{ alignItems: 'center' }}>
					<Text
						variant="headlineMedium"
						style={{ fontFamily: 'Manrope-Bold', textAlign: 'center' }}
					>
						Welcome to Pigllet!
					</Text>

					<Text
						variant="bodyLarge"
						style={{
							fontFamily: 'Manrope-Regular',
							opacity: 0.7,
							textAlign: 'center',
							maxWidth: '80%',
						}}
					>
						Your simple way to manage money and stay in control.
					</Text>
				</View>

				<LinearGradient
					colors={[
						theme.colors.primary,
						theme.colors.secondary,
						theme.colors.tertiary,
					]}
					start={{ x: 1, y: 0 }}
					end={{ x: 0, y: 1 }}
					style={{
						alignItems: 'center',
						marginTop: 16,
						height: 49,
						borderRadius: 100,
					}}
				>
					<Button
						mode="contained"
						onPress={setMyApp}
						style={{ marginTop: 0, height: 48, backgroundColor: 'transparent' }}
						contentStyle={{ height: 48 }}
						labelStyle={{ fontFamily: 'Manrope-Medium', fontSize: 16 }}
						disabled={isSettingUp}
						loading={isSettingUp}
					>
						Get started
					</Button>
				</LinearGradient>
			</View>
		</View>
	);
}

// import { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import {
// 	ActivityIndicator,
// 	Button,
// 	Surface,
// 	Text,
// 	useTheme,
// } from 'react-native-paper';

// import { useRouter } from 'expo-router';
// import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

// import * as schema from '@/db/schema';
// import { incomeCategories } from '@/constants/income-category';
// import { expenseCategories } from '@/constants/expense-category';
// import { transferCategories } from '@/constants/transfer-category';

// import Animated, { FadeIn } from 'react-native-reanimated';
// import { SendHorizontalIcon } from 'lucide-react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// export default function OnboardingScreen() {
// 	const theme = useTheme();
// 	const router = useRouter();
// 	const drizzleDb = useDrizzleDB();

// 	const [index, setIndex] = useState(0);
// 	const [isSettingUp, setIsSettingUp] = useState<boolean>(false);

// 	const nextSection = () => {
// 		if (index < SECTIONS.length - 1) setIndex(index + 1);
// 	};

// 	const prevSection = () => {
// 		if (index > 0) setIndex(index - 1);
// 	};

// 	const imageRenderer = () => {
// 		if (index === 0)
// 			return (
// 				<Animated.Image
// 					key={index}
// 					entering={FadeIn.duration(350)}
// 					source={require('@/assets/images/onboarding/0.png')}
// 					style={styles.image}
// 				/>
// 			);

// 		return (
// 			<Animated.Image
// 				key={index}
// 				entering={FadeIn.duration(350)}
// 				source={require('@/assets/images/welcome image.png')}
// 				style={styles.image}
// 			/>
// 		);
// 	};

// 	const buttonRenderer = () => {
// 		if (index !== SECTIONS.length - 1)
// 			return (
// 				<Button
// 					mode="contained"
// 					onPress={nextSection}
// 					style={styles.button}
// 					labelStyle={styles.buttonLabel}
// 					contentStyle={styles.buttonContent}
// 					disabled={index === SECTIONS.length - 1 || isSettingUp}
// 				>
// 					Next
// 				</Button>
// 			);

// 		return (

// 		);
// 	};

// 	return (
// 		<LinearGradient
// 			colors={[theme.colors.background, 'transparent']}
// 			start={{ x: 0.5, y: 0.75 }}
// 			end={{ x: 0.5, y: 0.5 }}
// 			style={styles.container}
// 		>
// 			{imageRenderer()}

// 			<View style={styles.buttons}>
// 				<Button
// 					mode="contained"
// 					onPress={prevSection}
// 					disabled={index === 0 || isSettingUp}
// 					style={styles.button}
// 					labelStyle={styles.buttonLabel}
// 					contentStyle={styles.buttonContent}
// 				>
// 					Previous
// 				</Button>

// 				{buttonRenderer()}
// 			</View>
// 		</LinearGradient>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: { flex: 1, justifyContent: 'flex-end' },
// 	buttons: {
// 		flexDirection: 'row',
// 		justifyContent: 'space-between',
// 		padding: 40,
// 		paddingTop: 0,
// 	},
// 	button: { marginTop: 16 },
// 	buttonContent: {
// 		flexDirection: 'row-reverse',
// 	},
// 	buttonLabel: {
// 		fontFamily: 'Manrope-Medium',
// 		fontSize: 16,
// 		color: 'white',
// 	},
// 	title: {
// 		fontFamily: 'Manrope-ExtraBold',
// 		textAlign: 'center',
// 	},
// 	desc: {
// 		textAlign: 'center',
// 		fontFamily: 'Manrope-Regular',
// 		opacity: 0.7,
// 		maxWidth: '80%',
// 		alignSelf: 'center',
// 	},
// 	textContainer: {
// 		padding: 0,
// 		paddingBottom: 24,
// 	},
// 	image: {
// 		width: '100%',
// 		height: '100%',
// 		position: 'absolute',
// 		zIndex: -1,
// 		objectFit: 'contain',
// 	},
// 	counter: {
// 		marginTop: 24,
// 		width: 50,
// 		height: 30,
// 		borderRadius: 100,
// 		alignSelf: 'center',
// 		flexDirection: 'row',
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 	},
// });

