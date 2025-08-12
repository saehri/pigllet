import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { eq } from 'drizzle-orm';
import * as schema from '@/db/schema';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import SelectInput from '@/src/components/forms/select-input';
import IconSelector from '@/src/components/forms/icon-selector';

export default function CategoryForm() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const navigation = useNavigation();
	const { id, categType, formAction } = useLocalSearchParams();

	const [loading, setLoading] = useState(false);

	const [label, setLabel] = useState<string>('');
	const [iconName, setIconName] = useState<string>('');
	const [categoryType, setCategoryType] = useState<schema.TransactionType>(
		categType as schema.TransactionType
	);

	const createTransactionCategory = useCallback(async () => {
		try {
			setLoading(true);

			await drizzleDb.insert(schema.categories).values({
				icon_name: iconName,
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
	}, [label, iconName, categoryType]);

	const editTransactionCategory = useCallback(async () => {
		try {
			setLoading(true);

			await drizzleDb
				.update(schema.categories)
				.set({
					icon_name: iconName,
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
	}, [label, iconName, categoryType, id]);

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

	return (
		<View style={styles.formWrapper}>
			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Label
					</Text>

					<TextInput
						onChangeText={setLabel}
						value={label}
						contentStyle={styles.inputContent}
					/>
				</View>

				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Category type
					</Text>

					<SelectInput
						data={[
							{ label: 'Expense', value: 'expense' },
							{ label: 'Income', value: 'income' },
							{ label: 'Transfer', value: 'transfer' },
						]}
						value={categoryType}
						closeAfterSelect
						handleSelect={setCategoryType}
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
				disabled={!isFormReady}
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

