import { Redirect } from 'expo-router';

export default function Page() {
	const isSignedIn = true;

	if (isSignedIn) return <Redirect href="/(root)" />;

	return <Redirect href="/(auth)/welcome" />;
}
