import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { memo, useCallback, useRef } from 'react';
import { LayoutDashboardIcon } from 'lucide-react-native';
import { Button, Portal, Text, useTheme } from 'react-native-paper';

import { usePreferredStatsWindow } from '@/store/usePreferredStatsWindow';

import BottomSheetToggleButton from './bottom-sheet-toggle-button';

function StatisticsViewToggler() {
	const theme = useTheme();

	const bottomSheetRef = useRef<BottomSheet>(null);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

	return (
		<>
			<Button
				compact
				style={{
					height: 40,
					width: 40,
					backgroundColor: theme.colors.elevation.level5,
				}}
				onPress={() => bottomSheetRef.current?.snapToIndex(0)}
			>
				<LayoutDashboardIcon
					size={20}
					strokeWidth={1.5}
					color={theme.colors.onSurface}
				/>
			</Button>

			<Portal>
				<BottomSheet
					ref={bottomSheetRef}
					snapPoints={[480, '90%']}
					enablePanDownToClose={true}
					overDragResistanceFactor={0.5}
					enableDynamicSizing={false}
					backgroundStyle={{
						backgroundColor: theme.colors.elevation.level1,
					}}
					backdropComponent={renderBackdrop}
					index={-1}
					handleIndicatorStyle={{
						backgroundColor: theme.colors.secondary,
						height: 6,
						width: 35,
					}}
				>
					<BottomSheetView style={{ paddingHorizontal: 16, gap: 2 }}>
						<Text style={styles.checkboxSectionTitle}>By date</Text>
						<ExpenseByDateToggle />
						<IncomeByDateToggle />
						<TransferByDateToggle />

						<Text style={[styles.checkboxSectionTitle, { marginTop: 16 }]}>
							By category
						</Text>
						<ExpenseByCategoryToggle />
						<IncomeByCategoryToggle />
						<TransferByCategoryToggle />
					</BottomSheetView>
				</BottomSheet>
			</Portal>
		</>
	);
}

function ExpenseByDateToggle() {
	const value = usePreferredStatsWindow((s) => s.showExpenseByDate);
	const setValue = usePreferredStatsWindow((s) => s.setShowExpenseByDate);

	return (
		<BottomSheetToggleButton
			currentValue={value}
			setCurrentValue={setValue}
			label="Expenses by date"
			position="first"
		/>
	);
}

function IncomeByDateToggle() {
	const value = usePreferredStatsWindow((s) => s.showIncomeByDate);
	const setValue = usePreferredStatsWindow((s) => s.setShowIncomeByDate);

	return (
		<BottomSheetToggleButton
			currentValue={value}
			setCurrentValue={setValue}
			label="Incomes by date"
			position="middle"
		/>
	);
}

function TransferByDateToggle() {
	const value = usePreferredStatsWindow((s) => s.showTransferByDate);
	const setValue = usePreferredStatsWindow((s) => s.setShowTransferByDate);

	return (
		<BottomSheetToggleButton
			currentValue={value}
			setCurrentValue={setValue}
			label="Transfers by date"
			position="last"
		/>
	);
}

function ExpenseByCategoryToggle() {
	const value = usePreferredStatsWindow((s) => s.showExpenseByCategory);
	const setValue = usePreferredStatsWindow((s) => s.setShowExpenseByCategory);

	return (
		<BottomSheetToggleButton
			currentValue={value}
			setCurrentValue={setValue}
			label="Expenses by category"
			position="first"
		/>
	);
}

function IncomeByCategoryToggle() {
	const value = usePreferredStatsWindow((s) => s.showIncomeByCategory);
	const setValue = usePreferredStatsWindow((s) => s.setShowIncomeByCategory);

	return (
		<BottomSheetToggleButton
			currentValue={value}
			setCurrentValue={setValue}
			label="Incomes by category"
			position="middle"
		/>
	);
}

function TransferByCategoryToggle() {
	const value = usePreferredStatsWindow((s) => s.showTransferByCategory);
	const setValue = usePreferredStatsWindow((s) => s.setShowTransferByCategory);

	return (
		<BottomSheetToggleButton
			currentValue={value}
			setCurrentValue={setValue}
			label="Transfers by category"
			position="last"
		/>
	);
}

const styles = StyleSheet.create({
	checkboxSectionTitle: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
		marginBottom: 12,
	},
});

export default memo(StatisticsViewToggler);

