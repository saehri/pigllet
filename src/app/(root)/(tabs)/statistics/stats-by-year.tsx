import CashFlowSummary from '@/src/components/charts/spending-by-category';
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

