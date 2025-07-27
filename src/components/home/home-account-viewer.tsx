import { Button, ScrollView, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

import * as schema from '@/db/schema';
import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRightIcon } from 'lucide-react-native';
import { Link } from 'expo-router';

type Props = {
	accounts: schema.Account[];
};

export default function HomeAccountViewer({ accounts }: Props) {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	return (
		<View>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View style={styles.cardsContainer}>
					{accounts.map((data) => (
						<Surface
							style={[
								styles.cardWrapper,
								{ borderColor: theme.colors.outlineVariant },
							]}
							mode="flat"
							elevation={5}
							key={data.id}
						>
							<Text style={styles.cardText} variant="labelMedium">
								{data.name}
							</Text>
							<Text style={styles.cardText}>
								{`${currentCurrencySymbol} ${data.balance.toLocaleString(
									getLocaleByCurrencySymbol(currentCurrencySymbol)
								)}`}
							</Text>
						</Surface>
					))}

					<Link href={'/settings/accounts'}>
						<View
							style={[
								styles.buttonContent,
								{
									borderColor: theme.colors.primary,
									backgroundColor: theme.colors.elevation.level5,
								},
							]}
						>
							<ChevronRightIcon size={20} color={theme.colors.primary} />
						</View>
					</Link>
				</View>
			</ScrollView>

			<LinearGradient
				colors={[theme.colors.elevation.level3, 'transparent']}
				style={styles.linearGradient}
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 0 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	cardsContainer: {
		gap: 8,
		flexDirection: 'row',
		marginTop: 16,
		paddingRight: 30,
		alignItems: 'center',
	},
	cardWrapper: {
		padding: 10,
		borderRadius: 8,
		borderWidth: 1,
		gap: 12,
		minWidth: 140,
		minHeight: 80,
		justifyContent: 'space-between',
	},
	cardText: {
		fontFamily: 'Manrope-Regular',
	},
	linearGradient: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 50,
		height: '100%',
	},
	buttonContent: {
		height: 55,
		width: 55,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderStyle: 'dashed',
	},
});

