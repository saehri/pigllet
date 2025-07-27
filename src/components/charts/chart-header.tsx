import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { ArrowRightIcon, FilterIcon } from 'lucide-react-native';
import SelectInput from '../forms/select-input';

type Props = {
	startDate: Date;
	setStartDate: Dispatch<SetStateAction<Date>>;
	endDate: Date;
	setEndDate: Dispatch<SetStateAction<Date>>;
	quickFilter: string;
	setQuickFilter: Dispatch<SetStateAction<string>>;
};

export default function ChartHeader({
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	quickFilter,
	setQuickFilter,
}: Props) {
	const theme = useTheme();

	// Function to open the date picker
	const openStartDatePicker = () => {
		DateTimePickerAndroid.open({
			value: startDate,
			mode: 'date',
			display: 'default',
			firstDayOfWeek: 1,
			onChange: (event, date) => {
				if (date) {
					setStartDate(date);
					setQuickFilter('');
				}
			},
		});
	};

	// Function to open the date picker
	const openEndDatePicker = () => {
		DateTimePickerAndroid.open({
			value: endDate,
			mode: 'date',
			display: 'default',
			firstDayOfWeek: 1,
			onChange: (event, date) => {
				if (date) {
					setEndDate(date);
					setQuickFilter('');
				}
			},
		});
	};

	function handleQuickFilterChange(filter: string) {
		const date = new Date(),
			y = date.getFullYear(),
			m = date.getMonth();

		if (filter === 'today') {
			setStartDate(date);
			setEndDate(date);
		}
		if (filter === 'month') {
			setStartDate(new Date(y, m, 1));
			setEndDate(new Date(y, m + 1, 0));
		}
		if (filter === 'year') {
			setStartDate(new Date(y, 0, 1));
			setEndDate(new Date(y, 11, 31));
		}

		setQuickFilter(filter);
	}

	return (
		<View style={styles.container}>
			<Button
				onPress={openStartDatePicker}
				mode="outlined"
				labelStyle={styles.buttonLabel}
				style={[styles.button, { borderColor: theme.colors.outlineVariant }]}
				contentStyle={styles.buttonContent}
			>
				{startDate.toLocaleDateString('en-US', { dateStyle: 'medium' })}
			</Button>

			<View
				style={[
					styles.iconDividerContainer,
					{ backgroundColor: theme.colors.primary },
				]}
			>
				<ArrowRightIcon
					size={12}
					strokeWidth={1.5}
					color={theme.colors.background}
				/>
			</View>

			<Button
				onPress={openEndDatePicker}
				mode="outlined"
				labelStyle={styles.buttonLabel}
				style={[styles.button, { borderColor: theme.colors.outlineVariant }]}
				contentStyle={styles.buttonContent}
			>
				{endDate.toLocaleDateString('en-US', { dateStyle: 'medium' })}
			</Button>

			<SelectInput
				data={[
					{ label: 'Today', value: 'today' },
					{ label: 'This month', value: 'month' },
					{ label: 'This year', value: 'year' },
				]}
				handleSelect={handleQuickFilterChange}
				value={quickFilter}
				closeAfterSelect
				triggerButton={({ showDialog }) => (
					<Button
						onPress={showDialog}
						mode="outlined"
						compact
						style={{
							borderColor: theme.colors.outlineVariant,
							borderRadius: 11,
							height: 41,
						}}
					>
						<FilterIcon
							size={16}
							strokeWidth={1.5}
							color={theme.colors.primary}
						/>
					</Button>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 6,
		alignItems: 'center',
		padding: 16,
	},
	buttonLabel: {
		fontFamily: 'Manrope-Regular',
		width: '100%',
	},
	button: {
		flex: 1,
		borderRadius: 11,
		padding: 0,
	},
	iconDividerContainer: {
		width: 16,
		height: 16,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonContent: {
		padding: 0,
	},
});

