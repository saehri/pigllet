import { memo } from 'react';
import moment from 'moment';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';

type Props = {
	selectedDate: Date;
	onNext: () => void;
	onPrev: () => void;
};

function WeekSelectorBar({ selectedDate, onNext, onPrev }: Props) {
	const theme = useTheme();

	const dateDisplay = `${moment(selectedDate).startOf('week').format('MMM D')} - ${moment(selectedDate).endOf('week').format('MMM D, YYYY')}`;

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
				{dateDisplay}
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
			</View>
		</View>
	);
}

export default memo(WeekSelectorBar);

