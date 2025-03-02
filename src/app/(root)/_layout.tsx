import { Stack, useRouter } from 'expo-router';
import { Appbar } from 'react-native-paper';

export default function Layout() {
	const router = useRouter()

	return (
		<Stack
			screenOptions={{
				animation: 'ios_from_right',
			}}
		>
			<Stack.Screen name="index" options={{
				header: (props) => (
					<Appbar.Header>
						<Appbar.Content title="Pigllet" titleStyle={{ fontFamily: 'Inter-Black', letterSpacing: -0.5 }} />
					</Appbar.Header>
				)
			}} />
			<Stack.Screen name="settings" options={{
				header: (props) => (
					<Appbar.Header>
						<Appbar.BackAction onPress={() => router.back()} />
						<Appbar.Content title="Settings" titleStyle={{ fontFamily: 'Inter-Black', letterSpacing: -0.5 }} />
					</Appbar.Header>
				)
			}} />
		</Stack>
	);
}
