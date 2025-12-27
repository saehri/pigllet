import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import {
  DefaultTheme,
  PaperProvider,
  Text,
  ThemeProvider,
} from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";

// Drizzle & DB Imports
import { db } from "@/db/db";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import migrations from "@/drizzle/migrations";

// Store Imports
import { useAccountStore } from "@/store/useAccountStore";
import { useAppThemeStore } from "@/store/useAppThemeStore";
import { selectColorScheme } from "@/constants/color-scheme";
import { useTransactionStore } from "@/store/useTransactionStore"; // Your new store

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

function AppContents() {
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
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(root)" />
        </Stack>

        <StatusBar
          barStyle={
            currentAppTheme === "Dark" ? "light-content" : "dark-content"
          }
          backgroundColor={theme.colors.background}
        />
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  // 1. Load Fonts
  const [fontsLoaded, fontError] = useFonts({
    "Manrope-Bold": require("@/assets/fonts/Manrope-Bold.ttf"),
    "Manrope-ExtraBold": require("@/assets/fonts/Manrope-ExtraBold.ttf"),
    "Manrope-ExtraLight": require("@/assets/fonts/Manrope-ExtraLight.ttf"),
    "Manrope-Light": require("@/assets/fonts/Manrope-Light.ttf"),
    "Manrope-Medium": require("@/assets/fonts/Manrope-Medium.ttf"),
    "Manrope-Regular": require("@/assets/fonts/Manrope-Regular.ttf"),
    "Manrope-SemiBold": require("@/assets/fonts/Manrope-SemiBold.ttf"),
    BHG: require("@/assets/fonts/BBHHegarty-Regular.ttf"),
    GSans: require("@/assets/fonts/GSans-Variable.ttf"),
  });

  // 2. Run Database Migrations
  const { success: migrationSuccess, error: migrationError } = useMigrations(
    db,
    migrations,
  );

  useEffect(() => {
    async function prepareApp() {
      // Wait for fonts to load and migrations to finish
      if ((fontsLoaded || fontError) && migrationSuccess) {
        try {
          // 3. HYDRATE ZUSTAND (Fetch SQLite -> RAM)
          await Promise.all([
            useTransactionStore.getState().hydrate(),
            useAccountStore.getState().hydrate(),
          ]);
        } catch (e) {
          console.error("Hydration failed:", e);
        } finally {
          setAppIsReady(true);
          await SplashScreen.hideAsync();
        }
      }
    }

    prepareApp();
  }, [fontsLoaded, fontError, migrationSuccess]);

  // Show migration error if it fails
  if (migrationError) {
    return (
      <ScrollView style={styles.errorContainer}>
        <Text variant="headlineSmall" style={{ color: "red" }}>
          Migration Error
        </Text>
        <Text>{migrationError.message}</Text>
      </ScrollView>
    );
  }

  // Keep showing splash screen (null) until app is ready
  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContents />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 50,
  },
});
