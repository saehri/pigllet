import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useContext, useEffect } from 'react';
import { ColorSchemeName, StatusBar, useColorScheme } from 'react-native';
import { DefaultTheme, PaperProvider, ThemeProvider } from 'react-native-paper';

import * as SplashScreen from 'expo-splash-screen';

import UserPreferenceProvider, {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import {
	CITRINE_DARK,
	CITRINE_LIGHT,
	DEFAULT_DARK,
	DEFAULT_LIGHT,
	EMERALD_DARK,
	EMERALD_LIGHT,
	ONYX_DARK,
	ONYX_LIGHT,
	selectColorScheme,
} from '@/constants/color-scheme';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

function App() {
	const colorScheme = useColorScheme();
	const { currentAppTheme, currentAppColor } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const theme = {
		...DefaultTheme,
		colors: selectColorScheme(currentAppTheme, currentAppColor, colorScheme),
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

export default function RootLayout() {
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

	return (
		<UserPreferenceProvider>
			<App />
		</UserPreferenceProvider>
	);
}
