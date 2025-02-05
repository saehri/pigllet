import {
	View,
	Text,
	SafeAreaView,
	ScrollView,
	Alert,
	Modal,
	Pressable,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import FormField from '@/components/form/form-field';
import Button from '@/components/buttons/custom-button';
import BirthdayGenderForm from '@/components/form/birthday-gender-form';
import { AuthContext, AuthContextTypes } from '@/context/AuthProvider';

const RegisterScreen = () => {
	const router = useRouter();

	const { register } = useContext(AuthContext) as AuthContextTypes;

	const [fullName, setFullName] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [job, setJob] = useState<string>('');
	const [birthday, setBirthday] = useState<string>('');
	const [gender, setGender] = useState<string>('Male');
	const [password, setPassword] = useState<string>('');

	const handleRegister = async () => {
		if (
			!fullName ||
			!username ||
			!email ||
			!job ||
			!birthday ||
			!gender ||
			!password
		) {
			Alert.alert('Error', 'Please fill out all fields');
			return;
		}

		try {
			const newUser = {
				id: Date.now(),
				fullname: fullName,
				username: username,
				email: email,
				birthday: birthday,
				gender: gender,
				password: password,
			};

			await register(newUser);
			router.push('/(auth)/login-screen');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 80 }}
			className="pt-16 px-10"
		>
			<Text className="font-bold text-center mb-8 text-2xl text-slate-900">
				Register Account
			</Text>

			<FormField
				label="Full Name"
				placeholder="Enter your full name..."
				value={fullName}
				onChangeText={setFullName}
			/>
			<FormField
				label="Username"
				placeholder="Enter your username..."
				value={username}
				onChangeText={setUsername}
			/>
			<FormField
				label="Email"
				placeholder="Enter your email..."
				keyboardType="email-address"
				value={email}
				onChangeText={setEmail}
			/>
			<FormField
				label="Job"
				placeholder="Enter your job..."
				value={job}
				onChangeText={setJob}
			/>

			<BirthdayGenderForm setBirthday={setBirthday} setGender={setGender} />

			<FormField
				label="Password"
				placeholder="Enter your password..."
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>

			<Button type="main" text="Register" onPress={handleRegister} />
			<Button
				type="secondary"
				text="I already have an account"
				onPress={() => router.replace('/(auth)/login-screen')}
			/>
		</ScrollView>
	);
};

export default RegisterScreen;
