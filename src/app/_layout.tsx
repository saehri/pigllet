import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { DefaultTheme, PaperProvider, ThemeProvider } from 'react-native-paper';

import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

const LIGHT_COLOR_SCHEME = {
	colors: {
		primary: 'hsl(348, 60.60%, 42.70%)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(255, 218, 219)',
		onPrimaryContainer: 'rgb(64, 0, 15)',
		secondary: 'rgb(156, 64, 75)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(255, 218, 219)',
		onSecondaryContainer: 'rgb(64, 0, 14)',
		tertiary: '#984064',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(255, 217, 227)',
		onTertiaryContainer: 'rgb(62, 0, 31)',
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
		backdrop: 'rgba(59, 45, 46, 0.5)',
	},
};

const DARK_COLOR_SCHEME = {
	colors: {
		primary: 'rgb(255, 178, 184)',
		onPrimary: 'rgb(103, 0, 30)',
		primaryContainer: 'rgb(142, 14, 47)',
		onPrimaryContainer: 'rgb(255, 218, 219)',
		secondary: 'rgb(255, 178, 183)',
		onSecondary: 'rgb(96, 18, 32)',
		secondaryContainer: 'rgb(126, 41, 53)',
		onSecondaryContainer: 'rgb(255, 218, 219)',
		tertiary: 'rgb(255, 176, 203)',
		onTertiary: 'rgb(94, 16, 53)',
		tertiaryContainer: 'rgb(123, 40, 76)',
		onTertiaryContainer: 'rgb(255, 217, 227)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(14, 14, 14)',
		onBackground: 'rgb(236, 224, 223)',
		surface: 'rgb(32, 26, 26)',
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
			level3: 'rgb(57, 43, 43)',
			level4: 'rgb(59, 44, 45)',
			level5: 'rgb(63, 47, 48)',
		},
		surfaceDisabled: 'rgba(236, 224, 223, 0.12)',
		onSurfaceDisabled: 'rgba(236, 224, 223, 0.38)',
		backdrop: 'rgba(0, 0, 0, 0.5)',
	},
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded, error] = useFonts({
		'Inter-Black': require('@/assets/fonts//Inter_18pt-Black.ttf'),
		'Inter-Bold': require('@/assets/fonts/Inter_18pt-Bold.ttf'),
		'Inter-Light': require('@/assets/fonts/Inter_18pt-Light.ttf'),
		'Inter-Medium': require('@/assets/fonts/Inter_18pt-Medium.ttf'),
		'Inter-SemiBold': require('@/assets/fonts/Inter_18pt-SemiBold.ttf'),
		'Inter-Regular': require('@/assets/fonts/Inter_24pt-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	const theme = {
		...DefaultTheme,
		colors:
			colorScheme === 'dark'
				? DARK_COLOR_SCHEME.colors
				: LIGHT_COLOR_SCHEME.colors,
	};

	return (
		<PaperProvider theme={theme}>
			<ThemeProvider theme={theme}>
				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: { backgroundColor: theme.colors.background },
					}}
				>
					<Stack.Screen name="index" />
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(root)" />
				</Stack>
			</ThemeProvider>

			<StatusBar
				barStyle={colorScheme === 'dark' ? 'dark-content' : 'light-content'}
			/>
		</PaperProvider>
	);
}
