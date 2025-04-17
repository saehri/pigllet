import { View, StyleSheet } from 'react-native';
import { Button, ProgressBar, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { TextRef } from 'react-native-paper/lib/typescript/components/Typography/Text';
import { useFloating, shift, flip } from '@floating-ui/react-native';
import { useEffect, useRef, useState } from 'react';

import TransactionIcons from '../reusables/transaction-icons';

type MeaserResultType = {
	x: number;
	y: number;
	width: number;
	height: number;
	pageX: number;
	pageY: number;
};

export default function BudgetCard() {
	const [progressBarState, setProgressBarState] = useState(0);

	const theme = useTheme();

	function increaseProgressBar() {
		if (progressBarState + 0.1 <= 1) setProgressBarState((prev) => prev + 0.1);
	}

	function decreseProgressBar() {
		if (progressBarState - 0.1 >= 0) setProgressBarState((prev) => prev - 0.1);
	}

	return (
		<View
			style={[styles.container, { borderColor: theme.colors.outlineVariant }]}
		>
			<LinearGradient
				colors={[theme.colors.elevation.level5, theme.colors.elevation.level4]}
				style={styles.linearGradient}
			>
				<View style={styles.header}>
					<View style={styles.icon}>
						<TransactionIcons icon="foods-and-drinks" />
					</View>

					<View>
						<Text variant="titleMedium" style={{ fontFamily: 'Inter-Regular' }}>
							Foods & Drinks
						</Text>

						<Text
							variant="bodySmall"
							style={{ fontFamily: 'Inter-Regular', opacity: 0.8 }}
						>
							April, 2025
						</Text>
					</View>
				</View>

				<ProgressBarWithLabel progressBarState={progressBarState} />

				{/* <View>
					<Text>Rp 250.000 of </Text>
				</View> */}

				<View>
					<Button onPress={decreseProgressBar}>Reduce</Button>
					<Button onPress={increaseProgressBar}>Increase</Button>
				</View>
			</LinearGradient>
		</View>
	);
}

type ProgressBarWithLabelProps = {
	progressBarState: number;
};

function ProgressBarWithLabel({ progressBarState }: ProgressBarWithLabelProps) {
	const [labelIntersecting, setLabelIntersecting] = useState(false);
	const [referenceRect, setReferenceRect] = useState();
	const [floatingRect, setFloatingRect] = useState();

	const theme = useTheme();

	const referenceRef = useRef<View>(null);
	const floatingRef = useRef<View>(null);

	useEffect(() => {
		if (floatingRef.current && referenceRef.current?.measure) {
			let referenceRefRect: MeaserResultType | undefined;
			let floatingLabelRect: MeaserResultType | undefined;

			referenceRef.current.measure((x, y, width, height, pageX, pageY) => {
				referenceRefRect = { x, y, width, height, pageX, pageY };
			});
			floatingRef.current.measure((x, y, width, height, pageX, pageY) => {
				floatingLabelRect = { x, y, width, height, pageX, pageY };
			});

			if (referenceRefRect && floatingLabelRect) {
				const isInterSecting =
					referenceRefRect.width -
					(floatingLabelRect.width);

				console.log(isInterSecting);

				setLabelIntersecting(isInterSecting < 0);
			}
		}
	}, [floatingRef, referenceRef, progressBarState]);

	return (
		<View>
			<View ref={referenceRef}>
				<ProgressBar animatedValue={progressBarState} />
			</View>

			<View
				style={[
					styles.floatingLabelContainer,
					{
						left: labelIntersecting ? 'auto' : `${progressBarState * 100}%`,
						right: labelIntersecting
							? `${(1 - progressBarState) * 100}%`
							: 'auto',
					},
				]}
				ref={floatingRef}
			>
				<Text
					variant="labelSmall"
					style={[
						styles.floatingLabel,
						{
							color: theme.colors.onPrimary,
							backgroundColor: theme.colors.primary,
						},
					]}
				>
					Rp 250.000
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 20,
		borderWidth: 1,
		overflow: 'hidden',
	},
	linearGradient: {
		padding: 16,
	},
	header: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
		marginBottom: 16,
	},
	icon: {
		width: 40,
		height: 40,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(153, 153, 153, 0.3)',
	},
	floatingLabel: {
		padding: 2,
		paddingHorizontal: 4,
		borderRadius: 2,
		fontFamily: 'Inter-Regular',
	},
	floatingLabelContainer: {
		position: 'absolute',
		top: 8,
	},
});
