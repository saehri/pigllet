import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import useAccountManager from '@/src/hooks/useAccountManager';
import ColorPicker from '@/src/components/forms/color-picker';
import CustomTextInput from '@/src/components/forms/custom-text-input';
import AccountCardPreview from '@/src/components/reusables/account-card-preview';

const cardColors = ['#EA1C7E', '#ecb201ff', '#1ab3b3ff'];

export default function MainAccountSetupScreen() {
	const theme = useTheme();

	const {
		createMainAccount,
		loading,
		accountName,
		accountHolder,
		accountNumber,
		cardColor,
		setCardColor,
		setAccountName,
		setAccountHolder,
		setAccountNumber,
	} = useAccountManager();

	const isFormReady = () => {
		return Boolean(accountName.length && accountHolder.length);
	};

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			<View style={styles.contentContainer}>
				<Text variant="headlineSmall" style={styles.headlineLarge}>
					Let's set up your main account!
				</Text>

				<View style={{ gap: 24, paddingHorizontal: 14 }}>
					<AccountCardPreview
						isDefault
						animationKey={cardColor}
						accountName={accountName}
						accountHolder={accountHolder}
						cardColor={cardColor}
						accountNumber={accountNumber}
					/>

					<View style={styles.colorPickers}>
						{cardColors.map((color) => (
							<Pressable
								key={color}
								style={[
									styles.colorPickerButton,
									{
										backgroundColor: color,
										borderColor:
											color === cardColor ? theme.colors.primary : color,
									},
								]}
								onPress={() => setCardColor(color)}
							></Pressable>
						))}

						<ColorPicker setCardColor={setCardColor} />
					</View>
				</View>

				<View style={styles.formWrapper}>
					<View style={styles.gridContainer}>
						<View style={styles.inputContainerFull}>
							<Text style={styles.inputLabel} variant="bodyMedium">
								Account name *
							</Text>

							<CustomTextInput
								value={accountName}
								onChangeText={setAccountName}
								placeholder="Cash"
							/>
						</View>

						<View style={styles.inputContainerFull}>
							<Text style={styles.inputLabel} variant="bodyMedium">
								Account holder *
							</Text>

							<CustomTextInput
								value={accountHolder}
								onChangeText={setAccountHolder}
								placeholder="John Doe"
							/>
						</View>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLabel} variant="bodyMedium">
							Account number
						</Text>

						<CustomTextInput
							value={accountNumber}
							onChangeText={setAccountNumber}
							placeholder="**** **** **** ****"
							maxLength={16}
						/>
					</View>

					<Button
						mode="contained"
						style={styles.button}
						contentStyle={styles.buttonContent}
						labelStyle={styles.buttonLabel}
						disabled={loading || !isFormReady()}
						loading={loading}
						onPress={createMainAccount}
					>
						Set up my main account
					</Button>

					<View>
						<Text variant="labelSmall" style={styles.labelSmall}>
							*This will be your main account
						</Text>
						<Text variant="labelSmall" style={styles.labelSmall}>
							**You can add more account by going to the setting.
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		padding: 16,
		justifyContent: 'space-between',
		flex: 1,
	},
	labelSmall: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.6,
		textAlign: 'center',
	},
	headlineLarge: {
		fontFamily: 'Manrope-ExtraBold',
		marginBottom: 24,
	},
	inputLabel: {
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
	},
	inputContent: {
		fontFamily: 'Manrope-Regular',
	},
	button: { borderRadius: 10, marginTop: 16 },
	buttonContent: {
		padding: 8,
	},
	buttonLabel: {
		fontFamily: 'Manrope-Medium',
		fontSize: 16,
	},
	inputContainer: {
		gap: 8,
	},
	inputContainerFull: {
		gap: 8,
		flex: 1,
	},
	gridContainer: {
		flexDirection: 'row',
		gap: 8,
	},
	formWrapper: {
		gap: 16,
		marginVertical: 24,
	},
	colorPickers: {
		flexDirection: 'row',
		gap: 24,
		justifyContent: 'center',
	},
	colorPickerButton: {
		width: 40,
		height: 40,
		borderRadius: 100,
		borderWidth: 2,
	},
});

