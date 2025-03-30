import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Dispatch, SetStateAction, memo } from 'react';

import YearPicker from '../forms/year-picker';

type Props = {
	selectedYear: number;
	setSelectedYear: Dispatch<SetStateAction<number>>;
	selectedMonth: number;
};

const ChartHeader = memo(
	({ selectedYear, setSelectedYear, selectedMonth }: Props) => {
		const date = new Date(
			`${selectedYear}-${selectedMonth}-1`
		).toLocaleDateString('us-US', { month: 'long', year: 'numeric' });

		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: '100%',
					alignItems: 'center',
					marginBottom: 12,
					flex: 1,
				}}
			>
				<Text
					style={{ fontFamily: 'Inter-Regular', textTransform: 'capitalize' }}
					variant="titleLarge"
				>
					{date}
				</Text>

				<YearPicker
					selectedYear={selectedYear}
					setSelectedYear={setSelectedYear}
				/>
			</View>
		);
	}
);

export default ChartHeader;
