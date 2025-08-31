import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Button, Text, useTheme } from 'react-native-paper';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

import ColorPicker from '@/src/components/forms/color-picker';
import useAccountManager from '@/src/hooks/useAccountManager';
import CustomTextInput from '@/src/components/forms/custom-text-input';
import AccountCardPreview from '@/src/components/reusables/account-card-preview';

const cardColors = ['#EA1C7E', '#ecb201ff', '#1ab3b3ff'];

export default function AddAccountScreen() {
	const theme = useTheme();

	const drizzleDb = useDrizzleDB();

	const { accountId: selectedAccountId } = useLocalSearchParams();
	const {
		createAccount,
		accountHolder,
		accountName,
		accountNumber,
		cardColor,
		loading,
		setAccountHolder,
		setAccountName,
		setAccountNumber,
		setCardColor,
	} = useAccountManager();

	useEffect(() => {
		async function load() {
			const accounts = await drizzleDb
				.select()
				.from(schema.accounts)
				.where(eq(schema.accounts.id, Number(selectedAccountId)));

			const { card_color, card_holder, card_name, card_number } = accounts[0];

			setAccountHolder(card_holder);
			setAccountName(card_name);
			setCardColor(card_color);
			setAccountNumber(card_number!);
		}

		load();
	}, []);

	const isFormReady = () => {
		return Boolean(accountName.length && accountHolder.length);
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View
				style={{
					gap: 24,
					paddingHorizontal: 30,
					paddingVertical: 24,
				}}
			>
				<AccountCardPreview
					animationKey={cardColor}
					isDefault={false}
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
						keyboardType="number-pad"
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
					onPress={createAccount}
				>
					Save changes
				</Button>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
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
		padding: 16,
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

