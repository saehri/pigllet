import { ChevronsLeft, ChevronsRight } from 'lucide-react-native';
import { Dispatch, SetStateAction, memo, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

type MonthTypes = { value: number; label: string };

const MONTHS: MonthTypes[] = [
	{ value: 0, label: 'all' },
	{ value: 1, label: 'january' },
	{ value: 2, label: 'february' },
	{ value: 3, label: 'march' },
	{ value: 4, label: 'april' },
	{ value: 5, label: 'may' },
	{ value: 6, label: 'june' },
	{ value: 7, label: 'july' },
	{ value: 8, label: 'august' },
	{ value: 9, label: 'september' },
	{ value: 10, label: 'october' },
	{ value: 11, label: 'november' },
	{ value: 12, label: 'december' },
];

type Props = {
	selectedMonth: MonthTypes;
	setSelectedMonth: Dispatch<SetStateAction<MonthTypes>>;
};

const ChartFooter = memo(({ selectedMonth, setSelectedMonth }: Props) => {
	const theme = useTheme();

	const selectPrevMonth = useCallback(() => {
		const newIndex = selectedMonth.value - 1;
		if (newIndex >= 0) {
			setSelectedMonth(MONTHS[newIndex]);
		}
	}, [selectedMonth, setSelectedMonth]);

	const selectNextMonth = useCallback(() => {
		const newIndex = selectedMonth.value + 1;
		if (newIndex <= MONTHS.length - 1) {
			setSelectedMonth(MONTHS[newIndex]);
		}
	}, [selectedMonth, setSelectedMonth]);

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			<View
				style={{
					flexDirection: 'row',
					gap: 9,
					paddingTop: 12,
					alignItems: 'center',
				}}
			>
				<Button
					onPress={selectPrevMonth}
					mode="outlined"
					style={{ borderColor: theme.colors.outlineVariant, borderRadius: 10 }}
					contentStyle={{ height: 36 }}
					disabled={selectedMonth.value === 0}
				>
					<ChevronsLeft color={theme.colors.primary} />
				</Button>

				<View style={{ width: 90 }}>
					<Text
						variant="bodyLarge"
						style={{ textTransform: 'capitalize', textAlign: 'center' }}
					>
						{selectedMonth.label}
					</Text>
				</View>

				<Button
					onPress={selectNextMonth}
					mode="outlined"
					style={{ borderColor: theme.colors.outlineVariant, borderRadius: 10 }}
					contentStyle={{ height: 36 }}
					disabled={selectedMonth.value === MONTHS.length - 1}
				>
					<ChevronsRight color={theme.colors.primary} />
				</Button>
			</View>
		</ScrollView>
	);
});

export default ChartFooter;
