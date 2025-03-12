import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Image, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function WelcomeScreen() {
	const theme = useTheme();

	const { setFirstTimer } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const router = useRouter();

	function skipAction() {
		setFirstTimer(false);
		router.push('/(root)/(tabs)/home');
	}

	return (
		<View
			style={{
				flex: 1,
				padding: 24,
				paddingVertical: 36,
				justifyContent: 'flex-end',
				gap: 36,
				backgroundColor: theme.colors.background,
			}}
		>
			<View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
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
					onPress={() => router.push('/(auth)/sign-up')}
				>
					Create an account
				</Button>

				<Button
					mode="outlined"
					style={{ borderRadius: 10 }}
					labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
					onPress={skipAction}
				>
					Skip for now
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
