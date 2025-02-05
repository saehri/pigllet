import { AuthContext, AuthContextTypes } from '@/context/AuthProvider';
import { Stack, useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';

export default function Layout() {
	const { userSession } = useContext(AuthContext) as AuthContextTypes;

	const router = useRouter();

	useEffect(() => {
		if (userSession) {
			router.replace('/(root)/(tabs)/home-screen');
		}
	}, [userSession, router]);

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="welcome-screen" />
			<Stack.Screen name="register-screen" />
			<Stack.Screen name="login-screen" />
		</Stack>
	);
}
