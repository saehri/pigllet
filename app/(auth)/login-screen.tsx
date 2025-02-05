import { View, Text, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import { Link, useRouter } from 'expo-router';

import FormField from '@/components/form/form-field';
import Button from '@/components/buttons/custom-button';
import { AuthContext, AuthContextTypes } from '@/context/AuthProvider';

const LoginScreen = () => {
	const router = useRouter();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const { login } = useContext(AuthContext) as AuthContextTypes;

	const handleLogin = async () => {
		try {
			await login(email, password);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 80 }}
			className="pt-14 px-10"
		>
			<View className="items-end justify-end mb-20">
				<Link href={'/(root)/(tabs)/home-screen'} className="w-36 text-right">
					<Text>Skip this process</Text>
				</Link>
			</View>

			<Text className="font-bold text-center mb-8 text-2xl text-slate-900">
				Login
			</Text>

			<FormField
				label="Email"
				placeholder="Enter your email..."
				keyboardType="email-address"
				value={email}
				onChangeText={setEmail}
			/>

			<FormField
				label="Password"
				placeholder="Enter your password..."
				onChangeText={setPassword}
				value={password}
			/>

			<Button type="main" text="Login" onPress={() => handleLogin()} />
			<Button
				type="secondary"
				text="Create an account"
				onPress={() => router.push('/register-screen')}
			/>
		</ScrollView>
	);
};

export default LoginScreen;
