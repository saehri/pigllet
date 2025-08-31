import { View } from 'react-native';
import { Dispatch, memo, SetStateAction } from 'react';
import { Button, Text, useTheme } from 'react-native-paper';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';

import moment from 'moment';

import MonthYearSelectorDialog from './month-year-selector-dialog';

type Props = {
	selectedDate: Date;
	setSelectedDate: Dispatch<SetStateAction<Date>>;
	onNext: () => void;
	onPrev: () => void;
	showAdvanceDataSelector?: boolean;
};

function MonthSelectorBar({
	selectedDate,
	setSelectedDate,
	onNext,
	onPrev,
	showAdvanceDataSelector = true,
}: Props) {
	const theme = useTheme();

	const renderAdvanceDateSelector = () => {
		if (showAdvanceDataSelector)
			return (
				<MonthYearSelectorDialog
					selectedValue={selectedDate}
					onValueChange={setSelectedDate}
				/>
			);

		return <></>;
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				height: 40,
				marginBottom: 16,
				flex: 1,
			}}
		>
			<Text style={{ fontFamily: 'Manrope-Medium' }} variant="titleLarge">
				{moment(selectedDate).format('MMM, YYYY')}
			</Text>

			<View style={{ flexDirection: 'row' }}>
				<Button
					compact
					contentStyle={{ height: 40 }}
					style={{
						borderTopRightRadius: 6,
						borderBottomRightRadius: 6,
						marginRight: 2,
						backgroundColor: theme.colors.elevation.level5,
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
					contentStyle={{ height: 40 }}
					style={{
						borderTopLeftRadius: 6,
						borderBottomLeftRadius: 6,
						backgroundColor: theme.colors.elevation.level5,
					}}
					onPress={onNext}
				>
					<ChevronRightIcon
						size={20}
						strokeWidth={1.5}
						color={theme.colors.onSurface}
					/>
				</Button>

				{renderAdvanceDateSelector()}
			</View>
		</View>
	);
}

export default memo(MonthSelectorBar);

