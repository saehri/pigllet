import TransactionHeaderBar from '@/src/components/home/transaction-header-bar';
import { useSelectedTransactions } from '@/store/useSelectedTransactions';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function Layout() {
	const theme = useTheme();
	const selectedTransactions = useSelectedTransactions(
		(s) => s.selectedTransactions
	);

	return (
		<View style={{ flex: 1 }}>
			<AppHeader
				transactionOverlayActive={Boolean(selectedTransactions.length)}
			/>

			<Stack
				initialRouteName="index"
				screenOptions={{
					contentStyle: {
						backgroundColor: theme.colors.background,
					},
					headerShadowVisible: false,
					headerTintColor: theme.colors.onBackground,
					headerTitleStyle: {
						fontFamily: 'Manrope-Regular',
						fontSize: 20,
					},
					headerStyle: { backgroundColor: theme.colors.background },
					headerShown: selectedTransactions.length ? false : true,
				}}
			>
				<Stack.Screen name="index" />
			</Stack>
		</View>
	);
}

type AppHeaderProps = {
	transactionOverlayActive: boolean;
};

function AppHeader({ transactionOverlayActive }: AppHeaderProps) {
	const theme = useTheme();

	const headerOverlayContent = () => {
		if (transactionOverlayActive) return <TransactionHeaderBar />;
	};

	return (
		<View
			style={{
				height: transactionOverlayActive ? 56 : 0,
				alignItems: 'center',
				justifyContent: 'flex-end',
				flexDirection: 'row',
				paddingHorizontal: 16,
				backgroundColor: theme.colors.background,
			}}
		>
			{headerOverlayContent()}
		</View>
	);
}

