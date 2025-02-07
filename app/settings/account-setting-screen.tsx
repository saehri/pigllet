import { router } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, Dimensions, ScrollView, View } from 'react-native';
import { Appbar, Avatar, Button, Text, useTheme } from 'react-native-paper';

export default function TransactionScreen() {
	const theme = useTheme();

	useEffect(() => {
		const backAction = () => {
			router.back();
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, []);

	return (
		<ScrollView
			style={{
				backgroundColor: theme.colors.background,
				minHeight: Dimensions.get('screen').height,
			}}
		>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => router.back()} />
				<Appbar.Content title="Account" />
			</Appbar.Header>

			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					gap: 24,
					marginTop: 64,
				}}
			>
				<Avatar.Text size={80} label="SB" />

				<View>
					<Text variant="headlineLarge" style={{ textAlign: 'center' }}>
						Saepul Bahri
					</Text>
					<Text
						variant="labelLarge"
						style={{ textAlign: 'center', opacity: 0.8 }}
					>
						bahreesaepul1@gmail.com
					</Text>
				</View>
			</View>

			<Button mode="contained" onPress={() => router.push('/auth-screen')}>
				Login
			</Button>
		</ScrollView>
	);
}
