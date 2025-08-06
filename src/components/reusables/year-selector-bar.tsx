import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import moment from 'moment';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import YearSelectorDialog from './year-selector-dialog';
import { Dispatch, SetStateAction } from 'react';

type Props = {
	selectedDate: Date;
	setSelectedDate: Dispatch<SetStateAction<Date>>;
	onNext: () => void;
	onPrev: () => void;
};

export default function YearSelectorBar({
	onNext,
	onPrev,
	selectedDate,
	setSelectedDate,
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
				marginBottom: 16,
			}}
		>
			<Text style={{ fontFamily: 'Manrope-Medium' }} variant="titleLarge">
				{moment(selectedDate).format('YYYY')}
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
						backgroundColor: theme.colors.secondaryContainer,
					}}
					onPress={onPrev}
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
						backgroundColor: theme.colors.secondaryContainer,
					}}
					onPress={onNext}
				>
					<ChevronRightIcon
						size={20}
						strokeWidth={1.5}
						color={theme.colors.onSecondaryContainer}
					/>
				</Button>

				<YearSelectorDialog
					onValueChange={setSelectedDate}
					selectedValue={selectedDate}
				/>
			</View>
		</View>
	);
}
