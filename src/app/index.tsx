import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { View } from 'react-native';

export default function Page() {
	const { firstTimer, loading } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	if (loading) return <View></View>;

	if (firstTimer) return <Redirect href="/(auth)/welcome" />;

	return <Redirect href="/(root)/(tabs)/home" />;
}
