import { View } from 'lucide-react-native';
import { Text } from 'react-native-paper';
import { Dispatch, SetStateAction } from 'react';

import YearPicker from '../forms/year-picker';

type Props = {
	selectedYear: number;
	setSelectedYear: Dispatch<SetStateAction<number>>;
};

export default function ChartHeader({ selectedYear, setSelectedYear }: Props) {
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				width: '100%',
				alignItems: 'center',
				marginBottom: 12,
			}}
		>
			<Text style={{ fontFamily: 'Inter-Regular' }} variant="titleLarge">
				March, {selectedYear}
			</Text>

			<YearPicker
				selectedYear={selectedYear}
				setSelectedYear={setSelectedYear}
			/>
		</View>
	);
}
