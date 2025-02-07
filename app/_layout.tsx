import { Stack } from 'expo-router';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

import * as SplashScreen from 'expo-splash-screen';
import { version } from 'react';
import { useColorScheme } from 'react-native';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

const LightColorScheme = {
	colors: {
		primary: 'rgb(175, 43, 69)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(255, 218, 219)',
		onPrimaryContainer: 'rgb(64, 0, 15)',
		secondary: 'rgb(154, 64, 87)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(255, 217, 223)',
		onSecondaryContainer: 'rgb(63, 0, 22)',
		tertiary: 'rgb(186, 26, 32)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(255, 218, 214)',
		onTertiaryContainer: 'rgb(65, 0, 3)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(255, 251, 255)',
		onBackground: 'rgb(32, 26, 26)',
		surface: 'rgb(255, 251, 255)',
		onSurface: 'rgb(32, 26, 26)',
		surfaceVariant: 'rgb(244, 221, 222)',
		onSurfaceVariant: 'rgb(82, 67, 68)',
		outline: 'rgb(133, 115, 116)',
		outlineVariant: 'rgb(215, 193, 194)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(54, 47, 47)',
		inverseOnSurface: 'rgb(251, 238, 238)',
		inversePrimary: 'rgb(255, 178, 185)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(251, 241, 246)',
			level2: 'rgb(249, 234, 240)',
			level3: 'rgb(246, 228, 235)',
			level4: 'rgb(245, 226, 233)',
			level5: 'rgb(244, 222, 229)',
		},
		surfaceDisabled: 'rgba(32, 26, 26, 0.12)',
		onSurfaceDisabled: 'rgba(32, 26, 26, 0.38)',
		backdrop: 'rgba(59, 45, 46, 0.4)',
	},
};

const DarkColorScheme = {
	colors: {
		primary: 'rgb(255, 178, 185)',
		onPrimary: 'rgb(103, 0, 30)',
		primaryContainer: 'rgb(141, 15, 47)',
		onPrimaryContainer: 'rgb(255, 218, 219)',
		secondary: 'rgb(255, 177, 192)',
		onSecondary: 'rgb(95, 17, 42)',
		secondaryContainer: 'rgb(124, 41, 64)',
		onSecondaryContainer: 'rgb(255, 217, 223)',
		tertiary: 'rgb(255, 179, 172)',
		onTertiary: 'rgb(104, 0, 8)',
		tertiaryContainer: 'rgb(147, 0, 16)',
		onTertiaryContainer: 'rgb(255, 218, 214)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(17, 17, 17)',
		onBackground: 'rgb(236, 224, 223)',
		surface: 'rgb(17, 17, 17)',
		onSurface: 'rgb(236, 224, 223)',
		surfaceVariant: 'rgb(82, 67, 68)',
		onSurfaceVariant: 'rgb(215, 193, 194)',
		outline: 'rgb(159, 140, 141)',
		outlineVariant: 'rgb(82, 67, 68)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(236, 224, 223)',
		inverseOnSurface: 'rgb(54, 47, 47)',
		inversePrimary: 'rgb(175, 43, 69)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(43, 34, 34)',
			level2: 'rgb(50, 38, 39)',
			level3: 'rgb(57, 43, 44)',
			level4: 'rgb(59, 44, 45)',
			level5: 'rgb(63, 47, 48)',
		},
		surfaceDisabled: 'rgba(236, 224, 223, 0.12)',
		onSurfaceDisabled: 'rgba(236, 224, 223, 0.38)',
		backdrop: 'rgba(59, 45, 46, 0.4)',
	},
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	const theme = {
		...DefaultTheme,
		colors:
			colorScheme === 'light'
				? LightColorScheme.colors
				: DarkColorScheme.colors,
	};

	return (
		<PaperProvider theme={theme}>
			<Stack
				screenOptions={{
					headerShown: false,
					animation: 'none',
				}}
			>
				<Stack.Screen name="index" />
				<Stack.Screen name="auth-screen" />
				<Stack.Screen name="setting-screen" />
				<Stack.Screen name="settings/account-setting-screen" />
			</Stack>
		</PaperProvider>
	);
}
