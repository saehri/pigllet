import {
	ActivityIndicator,
	Button,
	TextInput,
	useTheme,
} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import useAccountController from '@/src/hooks/useAccountManager';

export default function CreateMainAccountForm() {
	const theme = useTheme();
	const { createMainAccount, loading, accountBalance, setAccountBalance } =
		useAccountController();

	return (
		<View style={{ gap: 16, width: '100%' }}>
			<TextInput
				contentStyle={styles.inputContent}
				inputMode="numeric"
				value={accountBalance}
				onChangeText={setAccountBalance}
			/>

			<Button
				onPress={createMainAccount}
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonLabel}
			>
				{loading ? (
					<ActivityIndicator size={20} color={theme.colors.onPrimary} />
				) : (
					'Set up my main account'
				)}
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	inputContent: {
		fontFamily: 'Manrope-Regular',
	},
	button: {},
	buttonLabel: { fontFamily: 'Manrope-Medium' },
});

