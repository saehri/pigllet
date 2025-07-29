import {
	CalendarFoldIcon,
	CalendarRangeIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	SettingsIcon,
} from 'lucide-react-native';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import moment from 'moment';

export function MonthScreenHeaderRightPlaceholder() {
	const theme = useTheme();

	return (
		<Button
			mode="contained-tonal"
			contentStyle={{ height: 40 }}
			style={{ marginRight: 16 }}
		>
			<SettingsIcon
				strokeWidth={1.5}
				color={theme.colors.onSecondaryContainer}
				size={20}
			/>
		</Button>
	);
}

export function MonthScreenHeaderTitlePlaceholder() {
	const theme = useTheme();

	return (
		<View style={{ flexDirection: 'row', gap: 2 }}>
			<Button
				mode="contained-tonal"
				contentStyle={{ height: 40 }}
				style={{ width: 130 }}
				icon={(props) => (
					<CalendarFoldIcon
						size={props.size}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
				labelStyle={{ opacity: 0 }}
			>
				{moment(new Date()).format('MMM, YYYY')}
			</Button>
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
	);
}

export function YearlyScreenHeaderTitlePlaceholder() {
	const theme = useTheme();

	return (
		<View style={{ flexDirection: 'row', gap: 2 }}>
			<Button
				mode="contained-tonal"
				contentStyle={{ height: 40 }}
				icon={(props) => (
					<CalendarRangeIcon
						size={props.size}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
				labelStyle={{ opacity: 0 }}
			>
				{moment(new Date()).format('YYYY')}
			</Button>
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
	);
}

export function AllTransScreenHeaderTitlePlaceholder() {
	return (
		<Text
			style={{
				fontFamily: 'Manrope-Bold',
				letterSpacing: -1,
				fontSize: 20,
			}}
		>
			All transactions
		</Text>
	);
}
