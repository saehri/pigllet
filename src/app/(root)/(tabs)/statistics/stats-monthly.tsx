import CashFlowSummary from '@/src/components/charts/cash-flow-summary';
import MonthYearSelectorDialog from '@/src/components/reusables/month-year-selector-dialog';
import { useNavigation, useRouter } from 'expo-router';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	SettingsIcon,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, useTheme } from 'react-native-paper';

export default function StatsMonthlyScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const theme = useTheme();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	useEffect(() => {
		navigation.setOptions({
			headerTitle: () => (
				<View style={{ flexDirection: 'row', gap: 2 }}>
					<MonthYearSelectorDialog
						onValueChange={setSelectedDate}
						selectedValue={selectedDate}
					/>
					<Button
						compact
						mode="contained-tonal"
						contentStyle={{ height: 40 }}
						style={{
							borderTopRightRadius: 6,
							borderBottomRightRadius: 6,
						}}
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
						contentStyle={{ height: 40 }}
						style={{
							borderTopLeftRadius: 6,
							borderBottomLeftRadius: 6,
						}}
					>
						<ChevronRightIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					</Button>
				</View>
			),
			headerRight: () => (
				<Button
					mode="contained-tonal"
					onPress={() => router.push('/(root)/settings')}
					contentStyle={{ height: 40 }}
					style={{ marginRight: 16 }}
				>
					<SettingsIcon
						strokeWidth={1.5}
						color={theme.colors.onSecondaryContainer}
						size={20}
					/>
				</Button>
			),
		});
	}, [theme, selectedDate]);

	return (
		<ScrollView
			contentContainerStyle={{
				paddingTop: 70,
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<Surface mode="flat" elevation={3} style={[styles.section]}>
				<CashFlowSummary />
			</Surface>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	section: {
		padding: 16,
		borderRadius: 36,
	},
});

