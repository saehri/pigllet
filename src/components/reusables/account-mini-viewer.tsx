import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';

import * as schema from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

import { formatCurrencyByCode } from '@/utils/utils';
import { useCurrencyStyle } from '@/store/useCurrencyStyle';

export default function AccountMiniViewer() {
	const { currentCurrencyCode, showFraction, accountingStyle, showSuffix } =
		useCurrencyStyle();

	const [currentCardIndex, setCurrentCardIndex] = useState(0);

	const theme = useTheme();

	const drizzleDb = useDrizzleDB();
	const { data: account } = useLiveQuery(
		drizzleDb
			.select({
				id: schema.accounts.id,
				card_name: schema.accounts.card_name,
				balance: schema.accounts.balance,
				card_color: schema.accounts.card_color,
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

	const accountCardRenderer = useCallback(() => {
		if (account.length)
			return (
				<Animated.View
					key={currentCardIndex}
					entering={SlideInRight.duration(350)}
					exiting={SlideOutRight.duration(350)}
				>
					<Surface
						style={[
							styles.card,
							{
								backgroundColor: account[currentCardIndex]?.card_color,
							},
						]}
					>
						<Text variant="labelSmall" style={styles.cardText}>
							{account[currentCardIndex]?.card_name}
						</Text>

						<Text variant="labelSmall" style={styles.cardText}>
							{formatCurrencyByCode(
								account[currentCardIndex]?.balance ?? 0,
								currentCurrencyCode,
								showFraction,
								accountingStyle,
								showSuffix
							)}
						</Text>
					</Surface>
				</Animated.View>
			);

		return <></>;
	}, [account]);

	return (
		<View style={styles.container}>
			<View style={styles.cardContainer}>{accountCardRenderer()}</View>

			<Button
				compact
				mode="contained-tonal"
				style={{
					borderTopRightRadius: 6,
					borderBottomRightRadius: 6,
					display: account.length > 1 ? 'flex' : 'none',
					backgroundColor: theme.colors.elevation.level5,
				}}
				onPress={prevAccount}
			>
				<ChevronLeftIcon
					size={20}
					strokeWidth={1.5}
					color={theme.colors.onSurface}
				/>
			</Button>
			<Button
				compact
				mode="contained-tonal"
				style={{
					borderTopLeftRadius: 6,
					borderBottomLeftRadius: 6,
					display: account.length > 1 ? 'flex' : 'none',
					backgroundColor: theme.colors.elevation.level5,
				}}
				onPress={nextAccount}
			>
				<ChevronRightIcon
					size={20}
					strokeWidth={1.5}
					color={theme.colors.onSurface}
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
		color: 'white',
	},
});

