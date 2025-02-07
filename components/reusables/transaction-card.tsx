import { View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

interface TransactionCard {
	type: 'expense' | 'income' | 'transfer';
}

export default function TransactionCard(props: TransactionCard) {
	const theme = useTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				gap: 12,
				alignItems: 'center',
				paddingVertical: 16,
				paddingHorizontal: 16,
			}}
		>
			<View
				style={{
					width: 40,
					height: 40,
					backgroundColor: theme.colors.primary,
					borderRadius: 100,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Icon size={24} source="bank-transfer" color={theme.colors.surface} />
			</View>

			<View style={{ flex: 1 }}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: 16,
					}}
				>
					<Text variant="bodyLarge">Mie ayam</Text>
					<Text variant="bodyLarge">Rp 15.000</Text>
				</View>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: 64,
					}}
				>
					<Text variant="bodySmall">Food</Text>
					<Text variant="labelSmall" style={{ opacity: 0.8 }}>
						Feb 8 2025
					</Text>
				</View>
			</View>
		</View>
	);
}
