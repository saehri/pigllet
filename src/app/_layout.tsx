import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Suspense, useEffect } from 'react';
import { useColorScheme, View, ScrollView, StyleSheet } from 'react-native';
import {
	DefaultTheme,
	PaperProvider,
	Text,
	ThemeProvider,
} from 'react-native-paper';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import migrations from '@/drizzle/migrations';

import * as SplashScreen from 'expo-splash-screen';

import { useAppThemeStore } from '@/store/useAppThemeStore';
import { selectColorScheme } from '@/constants/color-scheme';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
	duration: 350,
	fade: false,
});

const DATABASE_NAME = 'database.db';

function App() {
	const { currentAppTheme } = useAppThemeStore();

	const theme = {
		...DefaultTheme,
		colors: selectColorScheme(currentAppTheme),
	};

	return (
		<PaperProvider theme={theme} settings={{ rippleEffectEnabled: false }}>
			<ThemeProvider theme={theme}>
				<Stack
					screenOptions={{
						headerShown: false,
						headerShadowVisible: false,
						contentStyle: { backgroundColor: theme.colors.background },
						statusBarBackgroundColor: theme.colors.background,
					}}
				>
					<Stack.Screen name="index" />
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(root)" />
				</Stack>
			</ThemeProvider>
		</PaperProvider>
	);
}

export default function RootLayout() {
	// ---- fonts
	const [loaded, fontLoaderError] = useFonts({
		'Manrope-Bold': require('@/assets/fonts/Manrope-Bold.ttf'),
		'Manrope-ExtraBold': require('@/assets/fonts/Manrope-ExtraBold.ttf'),
		'Manrope-ExtraLight': require('@/assets/fonts/Manrope-ExtraLight.ttf'),
		'Manrope-Light': require('@/assets/fonts/Manrope-Light.ttf'),
		'Manrope-Medium': require('@/assets/fonts/Manrope-Medium.ttf'),
		'Manrope-Regular': require('@/assets/fonts/Manrope-Regular.ttf'),
		'Manrope-SemiBold': require('@/assets/fonts/Manrope-SemiBold.ttf'),
	});

	const colorScheme = useColorScheme();

	const expoDb = openDatabaseSync(DATABASE_NAME);
	const db = drizzle(expoDb);
	// --- migrate the database, the variables will be used to determine whether we should shows the app or not
	const { success: isMigrationSuccess, error: migrationError } = useMigrations(
		db,
		migrations
	);
	useDrizzleStudio(expoDb);

	useEffect(() => {
		if (loaded || fontLoaderError) {
			SplashScreen.hideAsync();
		}
	}, [loaded, fontLoaderError]);

	// --- Do not show app if the font is not loaded properly
	if (!loaded && !fontLoaderError) {
		return null;
	}

	// --- Shows the db migration error message
	if (!isMigrationSuccess)
		return (
			<ScrollView style={{ backgroundColor: '#fff' }}>
				<Text>{migrationError?.stack}</Text>
			</ScrollView>
		);

	return (
		<Suspense
			fallback={
				<View
					style={[
						styles.fallbackComponent,
						{ backgroundColor: colorScheme === 'dark' ? '#111' : '#fff' },
					]}
				></View>
			}
		>
			<SQLiteProvider
				databaseName={DATABASE_NAME}
				options={{ enableChangeListener: true }}
				useSuspense
			>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<App />
				</GestureHandlerRootView>
			</SQLiteProvider>
		</Suspense>
	);
}

const styles = StyleSheet.create({
	fallbackComponent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

