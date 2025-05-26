import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';
import useSubscriptionTrackerManager from '@/src/hooks/useSubscriptionTrackerManager';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';

import DatePicker from '../date-picker';
import SelectInput from '../select-input';

type Props = {
	subscriptionId: number;
};

export default function EditSubscriptionForm({ subscriptionId }: Props) {
	const theme = useTheme();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const {
		subscriptionStartedAt,
		subscriptionAmount,
		subscriptionDueDate,
		subscriptionBilled,
		subscriptionTitle,
		loading,
		setSubscriptionTitle,
		setSubscriptionBilled,
		setSubscriptionDueDate,
		setSubscriptionAmount,
		updateSubscriptionRecord,
		setSubscriptionStartedAt,
	} = useSubscriptionTrackerManager({ actionType: 'update', subscriptionId });

	const isUserPickedTheSameDate = true;

	return (
		<View style={styles.formWrapper}>
			<View style={styles.inputContainerFull}>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Title
				</Text>
				<TextInput
					value={subscriptionTitle}
					onChangeText={setSubscriptionTitle}
					contentStyle={styles.inputContent}
				/>
			</View>

			<View style={styles.gridContainer}>
				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Billed
					</Text>
					<SelectInput
						data={[
							{ label: 'Monthly', value: 'monthly' },
							{ label: 'Yearly', value: 'yearly' },
						]}
						value={subscriptionBilled}
						handleSelect={setSubscriptionBilled}
						closeAfterSelect
					/>
				</View>

				<View style={styles.inputContainerFull}>
					<Text style={styles.inputLabel} variant="bodyLarge">
						Amount ({currentCurrencySymbol})
					</Text>
					<TextInput
						keyboardType="number-pad"
						value={subscriptionAmount}
						onChangeText={setSubscriptionAmount}
						contentStyle={styles.inputContent}
					/>
				</View>
			</View>

			<View>
				<View style={styles.gridContainer}>
					<View style={styles.inputContainerFull}>
						<Text style={styles.inputLabel} variant="bodyLarge">
							Start at
						</Text>
						<DatePicker
							selectedDate={subscriptionStartedAt}
							setSelectedDate={setSubscriptionStartedAt}
						/>
					</View>

					<View style={styles.inputContainerFull}>
						<Text style={styles.inputLabel} variant="bodyLarge">
							Due date
						</Text>
						<DatePicker
							selectedDate={subscriptionDueDate}
							setSelectedDate={setSubscriptionDueDate}
						/>
					</View>
				</View>

				{isUserPickedTheSameDate && (
					<View style={styles.inputInfoContainer}>
						<Text style={styles.inputInfo} variant="bodySmall">
							The 'start at' date is when the subscription began.
						</Text>
						<Text style={styles.inputInfo} variant="bodySmall">
							The 'due date' refers to the upcoming billing date.
						</Text>
					</View>
				)}
			</View>

			<Button
				mode="contained"
				style={styles.button}
				labelStyle={styles.buttonLabel}
				onPress={updateSubscriptionRecord}
				disabled={!subscriptionAmount.length || !subscriptionTitle.length}
			>
				{loading ? (
					<ActivityIndicator size={20} color={theme.colors.onPrimary} />
				) : (
					'Save changes'
				)}
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	inputLabel: {
		fontFamily: 'Inter-Regular',
	},
	inputContent: {
		fontFamily: 'Inter-Regular',
	},
	button: { borderRadius: 10, marginTop: 16, padding: 8, marginBottom: 8 },
	buttonLabel: {
		fontFamily: 'Inter-Medium',
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
		padding: 16,
		gap: 16,
	},
	inputInfo: {
		opacity: 0.8,
	},
	inputInfoContainer: {
		marginTop: 8,
	},
});

