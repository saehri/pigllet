import { Dimensions, View } from 'react-native';
import { Icon, MD3Theme, Surface, Text, useTheme } from 'react-native-paper';

import WidgetWrapper from '../reusables/widget-wrapper';

export default function AccountOverviewWidget() {
	const theme = useTheme();

	return (
		<WidgetWrapper
			icon="finance"
			title="Overview"
			customStyle={{ marginHorizontal: 16, marginBottom: 5 }}
		>
			<BalanceStat theme={theme} />

			<View style={{ marginTop: 16, flexDirection: 'row', gap: 8 }}>
				<IncomeStat theme={theme} />
				<ExpenseStat theme={theme} />
			</View>
		</WidgetWrapper>
	);
}

/* 
----------------------------------------------------------------
*/

interface BalanceStat {
	theme: MD3Theme;
}

function BalanceStat(props: BalanceStat) {
	return (
		<View>
			<Text variant="bodyMedium">Your balance</Text>
			<Text
				variant="headlineLarge"
				style={{ color: props.theme.colors.primary, fontWeight: 'bold' }}
			>
				Rp 5.500.000
			</Text>
			<Text variant="labelSmall" style={{ opacity: 0.8 }}>
				This is the total money in all your wallets
			</Text>
		</View>
	);
}

interface IncomeStat {
	theme: MD3Theme;
}

function IncomeStat(props: IncomeStat) {
	return (
		<Surface
			elevation={5}
			mode="flat"
			style={{
				borderRadius: 8,
				padding: 8,
				width: (Dimensions.get('screen').width - 64 - 8) / 2,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					gap: 6,
					alignItems: 'center',
					opacity: 0.8,
				}}
			>
				<Icon
					size={14}
					color={props.theme.colors.primary}
					source="arrow-top-right-thin"
				/>
				<Text style={{ color: props.theme.colors.primary }}>Income</Text>
			</View>

			<View style={{ paddingLeft: 18 }}>
				<Text variant="bodyLarge">Rp 25.000.000</Text>
				<Text numberOfLines={2} variant="labelSmall" style={{ opacity: 0.8 }}>
					5% inrease from last month
				</Text>
			</View>
		</Surface>
	);
}

interface ExpenseStat {
	theme: MD3Theme;
}

function ExpenseStat(props: ExpenseStat) {
	return (
		<Surface
			elevation={5}
			mode="flat"
			style={{
				borderRadius: 8,
				padding: 8,
				width: (Dimensions.get('screen').width - 64 - 8) / 2,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					gap: 6,
					alignItems: 'center',
					opacity: 0.8,
				}}
			>
				<Icon
					size={14}
					color={props.theme.colors.primary}
					source="arrow-bottom-left-thin"
				/>
				<Text style={{ color: props.theme.colors.primary }}>Expense</Text>
			</View>

			<View style={{ paddingLeft: 18 }}>
				<Text variant="bodyLarge">Rp 20.500.000</Text>
				<Text numberOfLines={2} variant="labelSmall" style={{ opacity: 0.8 }}>
					15% down than last month
				</Text>
			</View>
		</Surface>
	);
}
