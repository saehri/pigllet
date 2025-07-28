import CashFlowSummary from '@/src/components/charts/cash-flow-summary';
import { useNavigation, useRouter } from 'expo-router';
import {
	CalendarIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	SettingsIcon,
} from 'lucide-react-native';
import { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

export default function StatsYearlyScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const theme = useTheme();

	useEffect(() => {
		navigation.setOptions({
			headerTitle: (props: any) => (
				<Text
					style={{ fontFamily: 'Manrope-Medium', letterSpacing: -0.5 }}
					variant="titleLarge"
				>
					July, 2025
				</Text>
			),
			headerRight: (props: any) => (
				<View style={{ flexDirection: 'row', paddingRight: 16 }}>
					<Button
						compact
						mode="contained-tonal"
						contentStyle={{ height: 40 }}
						style={{
							borderTopRightRadius: 6,
							borderBottomRightRadius: 6,
							marginRight: 2,
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
							marginRight: 2,
						}}
					>
						<ChevronRightIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					</Button>
					<Button mode="contained-tonal" contentStyle={{ height: 40 }}>
						<CalendarIcon
							size={20}
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
						/>
					</Button>
				</View>
			),
		});
	}, [theme]);

	return (
		<ScrollView>
			<Surface mode="flat" elevation={3} style={[styles.section]}>
				<CashFlowSummary />
			</Surface>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	section: {
		padding: 16,
		borderRadius: 36,
	},
});

