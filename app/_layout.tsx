import { Stack } from 'expo-router';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		myOwnColor: '#BADA55',
	},
};

export default function RootLayout() {
	return (
		<PaperProvider>
			<Stack
				screenOptions={{
					headerShown: false,
					animationDuration: 200,
				}}
			>
				<Stack.Screen name="index" />
				<Stack.Screen name="auth-screen" />
				<Stack.Screen name="settings/account-setting-screen" />
			</Stack>
		</PaperProvider>
	);
}
