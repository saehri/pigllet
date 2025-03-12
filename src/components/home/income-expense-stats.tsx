import { StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { MoveUpRight } from "lucide-react-native";

interface Props {
	label: 'Income' | 'Expense'
}

export default function IncomeExpenseStats({ label }: Props) {
	const theme = useTheme()

	return (
		<Surface
			elevation={5}
			mode="flat"
			style={styles.container}
		>
			<View
				style={styles.headerContainer}
			>
				<MoveUpRight
					size={14}
					color={theme.colors.primary}
				/>

				<Text style={[styles.headerText, { color: theme.colors.primary, }]}>{label}</Text>
			</View>

			<View style={styles.contentContainer}>
				<Text variant="bodyLarge" style={styles.contentText}>Rp 25.000.000</Text>
				<Text numberOfLines={2} variant="labelSmall" style={styles.contentCaption}>
					5% inrease from last month
				</Text>
			</View>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		padding: 6,
		flex: 1
	},
	headerContainer: {
		flexDirection: 'row',
		gap: 6,
		alignItems: 'center',
		opacity: 0.8,
	},
	headerText: {
		fontFamily: 'Inter-Light'
	},
	contentContainer: {
		paddingLeft: 18
	},
	contentText: {
		fontFamily: 'Inter-Regular'
	},
	contentCaption: {
		opacity: 0.8, fontFamily: 'Inter-Light'
	}
})