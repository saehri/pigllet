import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Suspense, useContext, useEffect } from 'react';
import {
	ColorSchemeName,
	StatusBar,
	useColorScheme,
	View,
	Image,
} from 'react-native';
import {
	ActivityIndicator,
	DefaultTheme,
	PaperProvider,
	ThemeProvider,
} from 'react-native-paper';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import migrations from '@/drizzle/migrations';

import * as SplashScreen from 'expo-splash-screen';

import UserPreferenceProvider, {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import { selectColorScheme } from '@/constants/color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

const DATABASE_NAME = 'database';

type AppProps = {
	colorScheme: ColorSchemeName;
};

function App({ colorScheme }: AppProps) {
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

			<StatusBar
				barStyle={colorScheme === 'dark' ? 'dark-content' : 'light-content'}
			/>
		</PaperProvider>
	);
}

export default function RootLayout() {
	const [loaded, fontLoaderError] = useFonts({
		'Inter-Black': require('@/assets/fonts//Inter_18pt-Black.ttf'),
		'Inter-Bold': require('@/assets/fonts/Inter_18pt-Bold.ttf'),
		'Inter-Light': require('@/assets/fonts/Inter_18pt-Light.ttf'),
		'Inter-Medium': require('@/assets/fonts/Inter_18pt-Medium.ttf'),
		'Inter-SemiBold': require('@/assets/fonts/Inter_18pt-SemiBold.ttf'),
		'Inter-Regular': require('@/assets/fonts/Inter_24pt-Regular.ttf'),
	});

	const colorScheme = useColorScheme();

	const expoDb = openDatabaseSync(DATABASE_NAME);
	const db = drizzle(expoDb);
	const { success, error } = useMigrations(db, migrations);
	useDrizzleStudio(expoDb);

	useEffect(() => {
		if (loaded || fontLoaderError) {
			SplashScreen.hideAsync();
		}
	}, [loaded, fontLoaderError]);

	if (!loaded && !fontLoaderError) {
		return null;
	}

	return (
		<Suspense
			fallback={
				<View
					style={{
						flex: 1,
						backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Image
						source={require('@/assets/icons/adaptive-icon.png')}
						style={{ width: 160, height: 160 }}
					/>
					<ActivityIndicator animating size={24} color="#af2b45" />
				</View>
			}
		>
			<SQLiteProvider
				databaseName={DATABASE_NAME}
				options={{ enableChangeListener: true }}
				useSuspense
			>
				<UserPreferenceProvider>
					<App colorScheme={colorScheme} />
				</UserPreferenceProvider>
			</SQLiteProvider>
		</Suspense>
	);
}
