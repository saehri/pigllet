import { View, StyleSheet } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { ArrowLeftRight, Pizza, MoveRight } from 'lucide-react-native';

interface TransactionCard {
	type: 'expense' | 'income' | 'transfer';
}

export default function TransactionCard(props: TransactionCard) {
	const theme = useTheme();

	const cardLabel = {
		expense: 'Mie ayam',
		income: 'Bank to Cash',
		transfer: 'Bank to Cash',
	};

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				{props.type === 'expense' ? (
					<Pizza
						color={theme.colors.onBackground}
						size={20}
						strokeWidth={1.5}
					/>
				) : props.type === 'income' ? (
					<ArrowLeftRight
						color={theme.colors.onBackground}
						size={20}
						strokeWidth={1.5}
					/>
				) : (
					<ArrowLeftRight
						color={theme.colors.onBackground}
						size={20}
						strokeWidth={1.5}
					/>
				)}
			</View>

			<View style={styles.contentContainer}>
				<View style={styles.labelContainer}>
					<View style={styles.row}>
						{props.type !== 'expense' ? (
							<>
								<Text variant="bodyLarge" style={styles.bodyLarge}>
									Bank
								</Text>
								<MoveRight
									color={theme.colors.onBackground}
									size={20}
									strokeWidth={1.5}
								/>
								<Text variant="bodyLarge" style={styles.bodyLarge}>
									Cash
								</Text>
							</>
						) : (
							<Text variant="bodyLarge" style={styles.bodyLarge}>
								{cardLabel[props.type]}
							</Text>
						)}
					</View>

					<Text variant="labelLarge" style={styles.bodyMedium}>
						Transaction category
					</Text>
				</View>

				<Text variant="bodyLarge" style={styles.bodyLarge}>
					Rp 15.000
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 12,
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(153, 153, 153, 0.3)',
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	labelContainer: {
		flexDirection: 'column',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
		flex: 1,
	},
	bodyLarge: {
		letterSpacing: -0.1,
		fontFamily: 'Inter-Regular',
	},
	bodyMedium: {
		letterSpacing: -0.1,
		fontFamily: 'Inter-Light',
		opacity: 0.8,
	},
});
