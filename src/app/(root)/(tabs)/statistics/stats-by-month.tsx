import { useState } from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';

import MonthSelectorBar from '@/src/components/reusables/month-selector-bar';
import SpendingByCategory from '@/src/components/charts/spending-by-category';

export default function StatsMonthlyScreen() {
	const theme = useTheme();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	function gotToNextMonth() {
		const updatedDate = new Date(selectedDate);
		updatedDate.setMonth(updatedDate.getMonth() + 1); // Handles year rollover automatically
		setSelectedDate(updatedDate);
	}

	function goToPreviousMonth() {
		const updatedDate = new Date(selectedDate);
		updatedDate.setMonth(updatedDate.getMonth() - 1); // Handles year rollover automatically
		setSelectedDate(updatedDate);
	}

	return (
		<ScrollView
			contentContainerStyle={{
				backgroundColor: theme.colors.background,
				paddingTop: 55,
				paddingBottom: 80,
			}}
			showsVerticalScrollIndicator={false}
		>
			<View>
				<MonthSelectorBar
					onNext={gotToNextMonth}
					onPrev={goToPreviousMonth}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>

				<View style={styles.cardContainer}>
					<Surface mode="flat" elevation={2} style={[styles.card]}>
						<Text style={styles.cardTitle} variant="bodyLarge">
							Spending by category
						</Text>
						<SpendingByCategory range="month" selectedDate={selectedDate} />
					</Surface>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 24,
		borderRadius: 40,
		gap: 16,
	},
	cardContainer: {
		marginTop: 24,
		gap: 4,
	},
	cardTitle: {
		fontFamily: 'Manrope-SemiBold',
	},
});

