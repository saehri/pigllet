import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Dispatch, SetStateAction, memo } from 'react';

import YearPicker from '../forms/year-picker';

type Props = {
	selectedYear: number;
	setSelectedYear: Dispatch<SetStateAction<number>>;
	selectedMonth: string;
};

const ChartHeader = memo(
	({ selectedYear, setSelectedYear, selectedMonth }: Props) => {
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
					{selectedMonth}, {selectedYear}
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
