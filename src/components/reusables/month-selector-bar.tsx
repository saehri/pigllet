import { View } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { Button, Text, useTheme } from 'react-native-paper';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';

import moment from 'moment';

import MonthYearSelectorDialog from './month-year-selector-dialog';

type Props = {
	selectedDate: Date;
	setSelectedDate: Dispatch<SetStateAction<Date>>;
	onNext: () => void;
	onPrev: () => void;
};

export default function MonthSelectorBar({
	selectedDate,
	setSelectedDate,
	onNext,
	onPrev,
}: Props) {
	const theme = useTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				paddingHorizontal: 16,
				alignItems: 'center',
				height: 40,
			}}
		>
			<Text style={{ fontFamily: 'Manrope-Medium' }} variant="titleLarge">
				{moment(selectedDate).format('MMM, YYYY')}
			</Text>

			<View style={{ flexDirection: 'row' }}>
				<Button
					compact
					mode="contained-tonal"
					contentStyle={{ height: 40 }}
					style={{
						borderTopRightRadius: 6,
						borderBottomRightRadius: 6,
						marginRight: 2,
						backgroundColor: theme.colors.elevation.level2,
					}}
					onPress={onPrev}
				>
					<ChevronLeftIcon
						size={20}
						strokeWidth={1.5}
						color={theme.colors.onSurface}
					/>
				</Button>
				<Button
					compact
					mode="contained-tonal"
					contentStyle={{ height: 40 }}
					style={{
						borderTopLeftRadius: 6,
						borderBottomLeftRadius: 6,
						backgroundColor: theme.colors.elevation.level2,
					}}
					onPress={onNext}
				>
					<ChevronRightIcon
						size={20}
						strokeWidth={1.5}
						color={theme.colors.onSurface}
					/>
				</Button>
				<MonthYearSelectorDialog
					onValueChange={setSelectedDate}
					selectedValue={selectedDate}
				/>
			</View>
		</View>
	);
}

