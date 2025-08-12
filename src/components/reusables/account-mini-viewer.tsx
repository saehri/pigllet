import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';

import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { formatCurrencyByCode } from '@/utils/utils';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

export default function AccountMiniViewer() {
	const { currentCurrencyCode } = usePreferredCurrencyStore();

	const [currentCardIndex, setCurrentCardIndex] = useState(0);

	const theme = useTheme();

	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const { data: account } = useLiveQuery(
		drizzleDb
			.select({
				id: schema.accounts.id,
				name: schema.accounts.name,
				balance: schema.accounts.balance,
			})
			.from(schema.accounts)
	);

	function nextAccount() {
		setCurrentCardIndex((prev) => (prev + 1 < account.length ? prev + 1 : 0));
	}

	function prevAccount() {
		setCurrentCardIndex((prev) =>
			prev - 1 >= 0 ? prev - 1 : account.length - 1
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.cardContainer}>
				<Animated.View
					key={currentCardIndex}
					entering={SlideInRight.duration(350).mass(100)}
					exiting={SlideOutRight.duration(350).mass(100)}
				>
					<Surface
						style={[
							styles.card,
							{
								backgroundColor: theme.colors.secondaryContainer,
							},
						]}
					>
						<Text
							variant="labelSmall"
							style={[
								styles.cardText,
								{ color: theme.colors.onSecondaryContainer },
							]}
						>
							{account[currentCardIndex]?.name}
						</Text>
						<Text
							variant="labelSmall"
							style={[
								styles.cardText,
								{ color: theme.colors.onSecondaryContainer },
							]}
						>
							{formatCurrencyByCode(
								account[currentCardIndex]?.balance ?? 0,
								currentCurrencyCode
							)}
						</Text>
					</Surface>
				</Animated.View>
			</View>

			<Button
				compact
				mode="contained-tonal"
				contentStyle={{ height: 40 }}
				style={{
					borderTopRightRadius: 6,
					borderBottomRightRadius: 6,
				}}
				onPress={prevAccount}
			>
				<ChevronLeftIcon
					size={20}
					strokeWidth={1.5}
					color={theme.colors.onSecondaryContainer}
				/>
			</Button>
			<Button
				compact
				mode="contained-tonal"
				style={{
					borderTopLeftRadius: 6,
					borderBottomLeftRadius: 6,
				}}
				onPress={nextAccount}
			>
				<ChevronRightIcon
					size={20}
					strokeWidth={1.5}
					color={theme.colors.onSecondaryContainer}
				/>
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 2,
	},
	cardContainer: {
		overflow: 'hidden',
	},
	card: {
		borderRadius: 12,
		padding: 4,
		paddingHorizontal: 12,
		height: 40,
		width: 120,
	},
	cardText: {
		fontFamily: 'Manrope-Regular',
	},
});

