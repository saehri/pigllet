import { View, StyleSheet } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

interface TransactionCard {
	type: 'expense' | 'income' | 'transfer';
}

export default function TransactionCard(props: TransactionCard) {
	const theme = useTheme();
	const iconName = {
		expense: 'food',
		income: 'arrow-bottom-left-thin',
		transfer: 'bank-transfer',
	};
	const cardLabel = {
		expense: 'Mie ayam',
		income: 'Bank to Cash',
		transfer: 'Bank to Cash',
	};

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<MaterialIcons name="fastfood" size={20} color={theme.colors.onBackground} />
			</View>

			<View style={styles.contentContainer}>
				<View style={styles.labelContainer}>
					<View style={styles.row}>
						{props.type !== 'expense' ? (
							<>
								<Text variant="bodyLarge" style={styles.bodyLarge}>
									Bank
								</Text>
								<Icon source="arrow-right" size={16} />
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
		backgroundColor: 'rgba(110, 110, 110, 0.1)'
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
