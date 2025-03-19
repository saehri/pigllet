import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import { Redirect } from 'expo-router';
import { useContext } from 'react';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

export default function Page() {
	const { firstTimer } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });

	if (!firstTimer) return <Redirect href="/(auth)/welcome" />;

	return <Redirect href="/(root)/(tabs)/home" />;
}
