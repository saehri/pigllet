import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import { Redirect } from 'expo-router';
import { useContext } from 'react';

export default function Page() {
	const { firstTimer } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	if (!firstTimer) return <Redirect href="/(auth)welcome" />;

	return <Redirect href="/(root)/(tabs)/home" />;
}
