import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useContext, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
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

	console.log({ currentAppColor, currentAppTheme });

	function selectColorScheme(theme: AppTheme, color: AppColor) {
		if (theme === 'Dark') {
			if (color === 'Default') {
				return DEFAULT_DARK.colors;
			}
			if (color === 'Emerald') {
				return EMERALD_DARK.colors;
			}
			if (color === 'Onyx') {
				return ONYX_DARK.colors;
			}
			if (color === 'Citrine') {
				return CITRINE_DARK.colors;
			}
		}

		if (theme === 'Light') {
			if (color === 'Default') {
				return DEFAULT_LIGHT.colors;
			}
			if (color === 'Emerald') {
				return EMERALD_LIGHT.colors;
			}
			if (color === 'Onyx') {
				return ONYX_LIGHT.colors;
			}
			if (color === 'Citrine') {
				return CITRINE_LIGHT.colors;
			}
		}

		if (theme === 'Device') {
			if (colorScheme === 'dark') {
				if (color === 'Default') {
					return DEFAULT_DARK.colors;
				}
				if (color === 'Emerald') {
					return EMERALD_DARK.colors;
				}
				if (color === 'Onyx') {
					return ONYX_DARK.colors;
				}
				if (color === 'Citrine') {
					return CITRINE_DARK.colors;
				}
			}

			if (colorScheme === 'light') {
				if (color === 'Default') {
					return DEFAULT_LIGHT.colors;
				}
				if (color === 'Emerald') {
					return EMERALD_LIGHT.colors;
				}
				if (color === 'Onyx') {
					return ONYX_LIGHT.colors;
				}
				if (color === 'Citrine') {
					return CITRINE_LIGHT.colors;
				}
			}
		}

		return DEFAULT_LIGHT.colors;
	}

	const theme = {
		...DefaultTheme,
		colors: selectColorScheme(currentAppTheme, currentAppColor),
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
