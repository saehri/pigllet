import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { Dispatch, SetStateAction, useState } from 'react';

import { CalendarFoldIcon } from 'lucide-react-native';
import { Button, Dialog, Portal, useTheme } from 'react-native-paper';
import { View } from 'react-native';

const months = [
	{ label: 'January', value: 0 },
	{ label: 'February', value: 1 },
	{ label: 'March', value: 2 },
	{ label: 'April', value: 3 },
	{ label: 'May', value: 4 },
	{ label: 'June', value: 5 },
	{ label: 'July', value: 6 },
	{ label: 'August', value: 7 },
	{ label: 'September', value: 8 },
	{ label: 'October', value: 9 },
	{ label: 'November', value: 10 },
	{ label: 'December', value: 11 },
];

const years = Array.from(
	{ length: 50 },
	(_, i) => new Date().getFullYear() - 25 + i
);

type Props = {
	selectedValue: Date;
	onValueChange: Dispatch<SetStateAction<Date>>;
};

export default function MonthYearSelectorDialog({
	onValueChange,
	selectedValue,
}: Props) {
	const theme = useTheme();

	const [visible, setVisible] = useState<boolean>(false);
	const [pickedMonth, setMonths] = useState<number>(selectedValue.getMonth());
	const [pickedYear, setYear] = useState<number>(new Date().getFullYear());
	const [buttonLabel, setButtonLabel] = useState(new Date());

	const openDialog = () => setVisible(true);
	const closeDialog = () => setVisible(false);
	const onConfirm = () => {
		const date = new Date();
		date.setMonth(pickedMonth);
		date.setFullYear(pickedYear);

		setButtonLabel(date);
		onValueChange(date);
		closeDialog();
	};

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={closeDialog}>
					<Dialog.Title
						style={{
							fontFamily: 'Manrope-Medium',
							letterSpacing: -0.2,
							fontSize: 20,
						}}
					>
						Pick the month and year
					</Dialog.Title>
					<Dialog.Content style={{ flexDirection: 'row', gap: 6 }}>
						<View
							style={{
								backgroundColor: theme.colors.elevation.level5,
								paddingHorizontal: 6,
								borderRadius: 12,
								overflow: 'hidden',
								flex: 1,
							}}
						>
							<Picker
								mode="dropdown"
								selectedValue={pickedMonth}
								onValueChange={(itemValue) => setMonths(itemValue)}
								style={{
									color: theme.colors.onSurface,
									backgroundColor: theme.colors.elevation.level5,
									borderRadius: 12,
									fontFamily: 'Manrope-Medium',
								}}
								dropdownIconColor={theme.colors.onSurface}
							>
								{months.map((month) => (
									<Picker.Item
										key={month.label}
										label={month.label}
										value={month.value}
										fontFamily="Manrope-Regular"
										color={
											pickedMonth === month.value
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

						<View
							style={{
								backgroundColor: theme.colors.elevation.level5,
								paddingHorizontal: 6,
								borderRadius: 12,
								overflow: 'hidden',
								flex: 1,
							}}
						>
							<Picker
								mode="dropdown"
								selectedValue={pickedYear}
								onValueChange={(itemValue) => setYear(itemValue)}
								style={{
									color: theme.colors.onSurface,
									backgroundColor: theme.colors.elevation.level5,
									borderRadius: 12,
									fontFamily: 'Manrope-Medium',
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
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={closeDialog}
							labelStyle={{ fontFamily: 'Manrope-Regular' }}
						>
							Cancel
						</Button>

						<Button
							labelStyle={{ fontFamily: 'Manrope-Regular' }}
							onPress={onConfirm}
						>
							Ok
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<Button
				mode="contained-tonal"
				onPress={openDialog}
				contentStyle={{ height: 40 }}
				icon={(props) => (
					<CalendarFoldIcon
						size={props.size}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			>
				{moment(buttonLabel).format('MMMM, YYYY')}
			</Button>
		</>
	);
}

