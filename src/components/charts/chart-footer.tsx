import { Pressable, ScrollView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const MONTHS = [
	{ value: 0, label: 'all' },
	{ value: 1, label: 'january' },
	{ value: 2, label: 'february' },
	{ value: 3, label: 'march' },
	{ value: 4, label: 'april' },
	{ value: 5, label: 'may' },
	{ value: 6, label: 'june' },
	{ value: 7, label: 'july' },
	{ value: 8, label: 'august' },
	{ value: 9, label: 'september' },
	{ value: 10, label: 'october' },
	{ value: 11, label: 'november' },
	{ value: 12, label: 'december' },
];

type Props = {};

export default function ChartFooter({}: Props) {
	const theme = useTheme();

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			<View style={{ flexDirection: 'row', gap: 9, paddingTop: 12 }}>
				{MONTHS.map((month) => (
					<Pressable
						key={month.label}
						style={{
							padding: 4,
							paddingHorizontal: 12,
							borderRadius: 200,
							backgroundColor: theme.colors.primary,
						}}
					>
						<Text
							style={{
								fontFamily: 'Inter-Regular',
								fontSize: 14,
								textTransform: 'capitalize',
								color: theme.colors.onPrimary,
							}}
						>
							{month.label}
						</Text>
					</Pressable>
				))}
			</View>
		</ScrollView>
	);
}
