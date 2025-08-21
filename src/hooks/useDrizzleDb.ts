import { useMemo } from 'react';
import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

export function useDrizzleDB() {
	const sqlite = useSQLiteContext();
	return useMemo(() => drizzle(sqlite, { schema }), [sqlite]);
}

