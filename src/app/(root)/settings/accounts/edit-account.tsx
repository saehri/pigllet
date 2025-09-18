import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { Trash2Icon } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

import ColorPicker from '@/src/components/forms/color-picker';
import useAccountManager from '@/src/hooks/useAccountManager';
import CustomTextInput from '@/src/components/forms/custom-text-input';
import AccountCardPreview from '@/src/components/reusables/account-card-preview';

const cardColors = ['#EA1C7E', '#ecb201ff', '#1ab3b3ff'];

export default function EditAccountScreen() {
	const theme = useTheme();
	const navigation = useNavigation();

	const drizzleDb = useDrizzleDB();

	const { accountId: selectedAccountId } = useLocalSearchParams();
	const {
		deleteAccount,
		editAccount,
		accountHolder,
		accountName,
		accountNumber,
		cardColor,
		isDefault,
		loading,
		setAccountHolder,
		setAccountName,
		setAccountNumber,
		setCardColor,
		setIsDefault,
	} = useAccountManager();

	useEffect(() => {
		async function load() {
			const accounts = await drizzleDb
				.select()
				.from(schema.accounts)
				.where(eq(schema.accounts.id, Number(selectedAccountId)));

			const { card_color, card_holder, card_name, card_number, is_default } =
				accounts[0];

			setAccountHolder(card_holder);
			setAccountName(card_name);
			setCardColor(card_color);
			setAccountNumber(card_number!);
			setIsDefault(Number(is_default));
		}

		load();

		navigation.setOptions({
			headerRight: () => (
				<DeleteButton
					formLoading={loading}
					handleDelete={() => deleteAccount(Number(selectedAccountId))}
				/>
			),
		});
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
					isDefault={Boolean(isDefault)}
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
					onPress={() => editAccount(Number(selectedAccountId))}
				>
					Save changes
				</Button>

				<Text
					style={{
						opacity: 0.7,
						fontFamily: 'Manrope-Regular',
						textAlign: 'center',
						maxWidth: 250,
						alignSelf: 'center',
					}}
					variant="labelSmall"
				>
					You might need to close and reopen the app for the change to take
					effect.
				</Text>
			</View>
		</ScrollView>
	);
}

type DeleteButtonProps = {
	formLoading: boolean;
	handleDelete: () => void;
};

function DeleteButton({ formLoading, handleDelete }: DeleteButtonProps) {
	const theme = useTheme();
	const [visible, setVisible] = useState<boolean>(false);

	const showModal = useCallback(() => setVisible(true), []);
	const hideModal = useCallback(() => setVisible(false), []);

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={hideModal}>
					<Dialog.Icon
						icon={(props) => (
							<Trash2Icon
								color={props.color}
								size={props.size}
								strokeWidth={1.5}
							/>
						)}
					/>
					<Dialog.Title
						style={{ textAlign: 'center', fontFamily: 'Manrope-Regular' }}
					>
						Delete account
					</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyLarge" style={{ fontFamily: 'Manrope-Regular' }}>
							All transaction records linked to this account will be deleted
							permanently. This action cannot be undone.
						</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button
							labelStyle={{ fontFamily: 'Manrope-Regular', fontSize: 16 }}
							onPress={hideModal}
						>
							Cancel
						</Button>
						<Button
							labelStyle={{ fontFamily: 'Manrope-Regular', fontSize: 16 }}
							onPress={() => {
								hideModal();
								handleDelete();
							}}
						>
							Delete
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<Button
				mode="contained-tonal"
				onPress={showModal}
				style={{ height: 40 }}
				labelStyle={{ fontFamily: 'Manrope-Regular' }}
				loading={formLoading}
				disabled={formLoading}
			>
				<Trash2Icon
					color={theme.colors.onSecondaryContainer}
					size={20}
					strokeWidth={1.5}
				/>
			</Button>
		</>
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

