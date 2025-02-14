import React from 'react';
import { View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

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
				<Icon
					size={24}
					source={iconName[props.type]}
					color={theme.colors.surface}
				/>
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
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 2,
							flex: 1,
						}}
					>
						{props.type !== 'expense' ? (
							<React.Fragment>
								<Text variant="bodyLarge">Bank</Text>
								<Icon source="arrow-right" size={16} />
								<Text variant="bodyLarge">Cash</Text>
							</React.Fragment>
						) : (
							<Text variant="bodyLarge">{cardLabel[props.type]}</Text>
						)}
					</View>
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
					<Text variant="bodySmall" style={{ textTransform: 'capitalize' }}>
						Transaction category
					</Text>
					<Text variant="labelSmall" style={{ opacity: 0.8 }}>
						Feb 8 2025
					</Text>
				</View>
			</View>
		</View>
	);
}
