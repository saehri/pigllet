import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

export default function TransactionsSummary() {
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<Surface
				mode="flat"
				elevation={1}
				style={[
					styles.itemContainer,
					{
						borderTopRightRadius: 16,
						borderTopLeftRadius: 16,
					},
				]}
			>
				<Text style={styles.itemText} variant="bodyMedium">
					Total income
				</Text>
				<Text style={styles.itemText} variant="bodyMedium">
					Rp 100.000
				</Text>
			</Surface>

			<Surface mode="flat" elevation={1} style={[styles.itemContainer]}>
				<Text style={styles.itemText} variant="bodyMedium">
					Total expense
				</Text>
				<Text style={styles.itemText} variant="bodyMedium">
					Rp 100.000
				</Text>
			</Surface>

			<Surface mode="flat" elevation={1} style={[styles.itemContainer]}>
				<Text style={styles.itemText} variant="bodyMedium">
					Total transfer
				</Text>
				<Text style={styles.itemText} variant="bodyMedium">
					Rp 100.000
				</Text>
			</Surface>

			<Surface
				mode="flat"
				elevation={1}
				style={[
					styles.itemContainer,
					{
						borderBottomRightRadius: 16,
						borderBottomLeftRadius: 16,
						backgroundColor: theme.colors.tertiaryContainer,
					},
				]}
			>
				<Text style={styles.itemText} variant="bodyMedium">
					Net balance
				</Text>
				<Text style={styles.itemText} variant="bodyMedium">
					Rp 50.000
				</Text>
			</Surface>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		gap: 2,
		overflow: 'hidden',
		height: 198,
	},
	itemContainer: {
		flexDirection: 'row',
		padding: 14,
		paddingHorizontal: 16,
		justifyContent: 'space-between',
		borderRadius: 6,
	},
	itemText: {
		fontFamily: 'Manrope-Regular',
	},
});

