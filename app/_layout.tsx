import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import AuthProvider from '@/context/AuthProvider';
import ExpenseProvider from '@/context/ExpensesProvider';
import UserProvider from '@/context/UserProvider';
import SubscriptionProvider from '@/context/SubscriptionProvider';

import '../global.css';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

export default function RootLayout() {
	return (
		<AuthProvider>
			<UserProvider>
				<ExpenseProvider>
					<SubscriptionProvider>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="index" />
							<Stack.Screen name="(root)" />
							<Stack.Screen name="(auth)" />
							<Stack.Screen name="create-expense-form-screen" />
							<Stack.Screen name="create-subscription-form-screen" />
							<Stack.Screen
								name="expense-details/:id"
								options={{ presentation: 'modal' }}
							/>

							<Stack.Screen
								name="expense-edit/:id"
								options={{ presentation: 'modal', animation: 'fade' }}
							/>
							<Stack.Screen
								name="expense-ocr/:id"
								options={{ presentation: 'modal', animation: 'fade' }}
							/>
							<Stack.Screen
								name="subscription-details/:id"
								options={{ presentation: 'modal' }}
							/>
							<Stack.Screen
								name="subscription-edit/:id"
								options={{ presentation: 'modal', animation: 'fade' }}
							/>
						</Stack>
					</SubscriptionProvider>
				</ExpenseProvider>
			</UserProvider>
		</AuthProvider>
	);
}
