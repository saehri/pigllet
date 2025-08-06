import { Picker } from '@react-native-picker/picker';
import { Dispatch, SetStateAction, useRef, useState } from 'react';

import { CalendarRangeIcon } from 'lucide-react-native';
import { Button, useTheme } from 'react-native-paper';
import { View } from 'react-native';

const years = Array.from(
	{ length: 50 },
	(_, i) => new Date().getFullYear() - 25 + i
);

type Props = {
	selectedValue: Date;
	onValueChange: Dispatch<SetStateAction<Date>>;
};

export default function YearSelectorDialog({
	onValueChange,
	selectedValue,
}: Props) {
	const theme = useTheme();

	const [pickedYear, setYear] = useState<number>(new Date().getFullYear());

	const onChange = (year: number) => {
		setYear(year);

		const date = new Date();
		date.setFullYear(year);

		onValueChange(date);
	};

	const pickerRef: any = useRef();

	function open() {
		pickerRef.current.focus();
	}

	return (
		<>
			<View
				style={{
					backgroundColor: theme.colors.elevation.level5,
					borderRadius: 12,
					overflow: 'hidden',
					height: 0,
					width: 0,
				}}
			>
				<Picker
					ref={pickerRef}
					mode="dialog"
					selectedValue={pickedYear}
					onValueChange={(itemValue) => onChange(itemValue)}
					style={{
						color: theme.colors.onSurface,
						backgroundColor: theme.colors.elevation.level5,
						borderRadius: 12,
						fontFamily: 'Manrope-Medium',
						textAlign: 'center',
						fontSize: 20,
					}}
					dropdownIconColor={theme.colors.onSurface}
				>
					{years.map((year) => (
						<Picker.Item
							key={year}
							label={year.toString()}
							value={year}
							fontFamily="Manrope-Regular"
							color={
								pickedYear === year
									? theme.colors.primary
									: theme.colors.onSurface
							}
							style={{
								backgroundColor: theme.colors.elevation.level5,
							}}
						/>
					))}
				</Picker>
			</View>

			<Button
				mode="contained-tonal"
				contentStyle={{ height: 40 }}
				onPress={open}
				style={{ backgroundColor: theme.colors.secondaryContainer }}
			>
				<CalendarRangeIcon
					strokeWidth={1.5}
					color={theme.colors.onSecondaryContainer}
					size={20}
				/>
			</Button>
		</>
	);
}

