import { Button, Text } from 'react-native-paper';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

import SelectInput from '@/src/components/forms/select-input';
import IconSelector from '@/src/components/forms/icon-selector';
import CustomTextInput from '@/src/components/forms/custom-text-input';

export default function CategoryForm() {
	const drizzleDb = useDrizzleDB();
	const navigation = useNavigation();
	const { id, categType, formAction } = useLocalSearchParams();

	const [loading, setLoading] = useState(false);

	const [label, setLabel] = useState<string>('');
	const [iconName, setIconName] = useState<string>('');
	const [categoryType, setCategoryType] = useState<schema.TransactionType>(
		categType as schema.TransactionType
	);

	const createTransactionCategory = async () => {
		try {
			setLoading(true);

			await drizzleDb.insert(schema.categories).values({
				icon_name: iconName.trim(),
				label: label,
				type: categoryType,
			});

			ToastAndroid.show(
				'Successfully created new category!',
				ToastAndroid.LONG
			);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.LONG);
		} finally {
			setLabel('');
			setIconName('');
			setLoading(false);
		}
	};

	const editTransactionCategory = async () => {
		try {
			setLoading(true);

			await drizzleDb
				.update(schema.categories)
				.set({
					icon_name: iconName.trim(),
					label: label,
					type: categoryType,
				})
				.where(eq(schema.categories.id, Number(id)));

			ToastAndroid.show(
				'Successfully created new category!',
				ToastAndroid.LONG
			);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.LONG);
		} finally {
			setLabel('');
			setIconName('');
			setLoading(false);
		}
	};

	const loadInitialFormData = useCallback(() => {
		return drizzleDb
			.select()
			.from(schema.categories)
			.where(eq(schema.categories.id, Number(id)));
	}, [id, formAction]);

	useEffect(() => {
		async function load() {
			const currentCategory = await loadInitialFormData();
			if (currentCategory.length) {
				const { icon_name, label: currentLabel, type } = currentCategory[0];
				setLabel(currentLabel);
				setIconName(icon_name);
				setCategoryType(type as schema.TransactionType);
			}
		}

		load();

		navigation.setOptions({
			title: formAction === 'create' ? 'New category' : 'Edit category',
		});
	}, []);

	const isFormReady = () => {
		if (label.length && iconName.length) return true;
		return false;
	};

	const buttonContentRenderer = () => {
		if (formAction === 'create') return 'New transaction category';
		return 'Edit transaction category';
	};

	console.log({ label, iconName, categoryType });

	return (
		<View style={styles.formWrapper}>
			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Label
					</Text>

					<CustomTextInput
						onChangeText={setLabel}
						value={label}
						placeholder="Cookies"
					/>
				</View>

				<View
					style={[
						styles.inputContainerFull,
						{ display: formAction === 'edit' ? 'none' : 'flex' },
					]}
				>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Category type
					</Text>

					<SelectInput
						data={[
							{ label: 'Expense', value: 'expense' },
							{ label: 'Income', value: 'income' },
							{ label: 'Transfer', value: 'transfer' },
						]}
						selectedValue={categoryType}
						setSelectedValue={setCategoryType}
					/>
				</View>
			</View>

			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Category icon
					</Text>

					<IconSelector selectedIconName={iconName} setIcon={setIconName} />
				</View>
			</View>

			<Button
				loading={loading}
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonLabel}
				contentStyle={styles.buttonContent}
				onPress={
					formAction === 'create'
						? createTransactionCategory
						: editTransactionCategory
				}
				disabled={!isFormReady()}
			>
				{buttonContentRenderer()}
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	inputLabel: {
		fontFamily: 'Manrope-Regular',
	},
	inputContent: {
		fontFamily: 'Manrope-Regular',
	},
	button: { borderRadius: 10, marginTop: 16 },
	buttonLabel: {
		fontFamily: 'Manrope-Medium',
		fontSize: 16,
	},
	buttonContent: {
		padding: 8,
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
		padding: 16,
		paddingTop: 16,
		gap: 16,
	},
});

