import { Stack } from 'expo-router';
import { StatusBar, useColorScheme } from 'react-native';
import { DefaultTheme, PaperProvider, ThemeProvider } from 'react-native-paper';

import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

const CustomColorScheme = {
	colors: {
		primary: 'rgb(255, 178, 185)',
		onPrimary: 'rgb(103, 0, 30)',
		primaryContainer: 'rgb(141, 15, 47)',
		onPrimaryContainer: 'rgb(255, 218, 219)',
		secondary: 'rgb(255, 177, 192)',
		onSecondary: 'rgb(95, 17, 42)',
		secondaryContainer: 'rgb(124, 41, 64)',
		onSecondaryContainer: 'rgb(255, 217, 223)',
		tertiary: 'rgb(255, 177, 193)',
		onTertiary: 'rgb(95, 17, 43)',
		tertiaryContainer: 'rgb(124, 41, 65)',
		onTertiaryContainer: 'rgb(255, 217, 223)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(32, 26, 26)',
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
		colors: CustomColorScheme.colors,
	};

	return (
		<PaperProvider theme={theme}>
			<ThemeProvider theme={theme}>
				<NavigationContainer>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="index" />
						<Stack.Screen name="(auth)" />
						<Stack.Screen name="(root)" />
					</Stack>
				</NavigationContainer>
			</ThemeProvider>

			<StatusBar
				barStyle={colorScheme === 'dark' ? 'dark-content' : 'light-content'}
			/>
		</PaperProvider>
	);
}
