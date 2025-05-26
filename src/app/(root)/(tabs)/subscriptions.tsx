import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import {
	FlatList,
	View,
	StyleSheet,
	ToastAndroid,
	Pressable,
} from 'react-native';
import {
	ActivityIndicator,
	Button,
	Surface,
	Text,
	useTheme,
} from 'react-native-paper';
import { useContext, useEffect, useState } from 'react';
import { CalendarIcon, RepeatIcon, TimerIcon } from 'lucide-react-native';

import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { toYYYYMMDD } from '@/utils/utils';
import { useSQLiteContext } from 'expo-sqlite';

import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import getLocaleByCurrencySymbol from '@/utils/locale-getter';
import useSubscriptionTrackerManager from '@/src/hooks/useSubscriptionTrackerManager';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import AccountSelector from '@/src/components/forms/account-selector';
import SelectInputWithIcon from '@/src/components/forms/select-input-with-icon';

function addMonths(date: Date, count: number) {
	const newDate = new Date(date);
	const d = newDate.getDate();

	newDate.setMonth(newDate.getMonth() + count);

	// Handle month overflow (e.g., Jan 31 → Feb 28/29)
	if (newDate.getDate() < d) {
		newDate.setDate(0); // Set to last day of previous month
	}

	return newDate;
}

function addYears(date: Date, count: number) {
	const newDate = new Date(date);
	newDate.setFullYear(newDate.getFullYear() + count);
	return newDate;
}

export default function SubscriptionScreen(props: any) {
	const theme = useTheme();
	const router = useRouter();
	const { currentCurrencySymbol } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;

	const { loadSubscriptionsData } = useSubscriptionTrackerManager({
		actionType: 'read',
	});

	const { data: subscriptions } = useLiveQuery(loadSubscriptionsData());

	return (
		<FlatList
			ListEmptyComponent={<NoItemNotice />}
			style={[styles.list, { backgroundColor: theme.colors.background }]}
			showsVerticalScrollIndicator={false}
			data={subscriptions}
			renderItem={({ item }) => (
				<Pressable
					key={item.id}
					onPress={() =>
						router.push({
							pathname: '/(root)/edit-subscription',
							params: {
								id: item.id,
								type: item.type,
							},
						})
					}
				>
					<Surface
						elevation={2}
						mode="flat"
						style={[styles.card, { borderColor: theme.colors.outlineVariant }]}
					>
						<View style={styles.headerRow}>
							<Text style={styles.title} variant="titleMedium">
								{item.name}
							</Text>

							<View
								style={[
									styles.divider,
									{ backgroundColor: theme.colors.outlineVariant },
								]}
							/>

							<Text style={styles.amount} variant="titleMedium">
								{`${currentCurrencySymbol} ${item.amount.toLocaleString(
									getLocaleByCurrencySymbol(currentCurrencySymbol)
								)}`}
							</Text>
						</View>

						<View
							style={[
								styles.detailContainer,
								{
									backgroundColor: theme.colors.elevation.level5,
									borderColor: theme.colors.outlineVariant,
								},
							]}
						>
							<View style={styles.detailRow}>
								<View
									style={[
										styles.detailBox,
										{
											backgroundColor: theme.colors.elevation.level3,
											borderColor: theme.colors.outlineVariant,
										},
									]}
								>
									<TimerIcon size={16} color={theme.colors.primary} />
									<Text style={styles.text}>
										{item.elapsed_due_date} days left
									</Text>
								</View>

								<View
									style={[
										styles.detailBox,
										{
											backgroundColor: theme.colors.elevation.level3,
											borderColor: theme.colors.outlineVariant,
										},
									]}
								>
									<CalendarIcon size={16} color={theme.colors.primary} />
									<Text style={styles.text} variant="labelLarge">
										Billed {item.billed}
									</Text>
								</View>
							</View>

							<View style={styles.footerRow}>
								<Text style={styles.text} variant="labelLarge">
									Start{' '}
									{new Date(item.started_at).toLocaleDateString('en-US', {
										dateStyle: 'medium',
									})}
								</Text>

								<RepeatIcon size={14} color={theme.colors.primary} />

								<Text style={styles.text} variant="labelLarge">
									Due{' '}
									{new Date(item.due_date).toLocaleDateString('en-US', {
										dateStyle: 'medium',
									})}
								</Text>
							</View>
						</View>

						{item.elapsed_due_date === 0 && (
							<MakePaymentButton subscription={item} />
						)}
					</Surface>
				</Pressable>
			)}
		/>
	);
}

type MakePaymentButtonTypes = {
	subscription: schema.Subscription;
};

export function MakePaymentButton({ subscription }: MakePaymentButtonTypes) {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const theme = useTheme();
	const transactionType = 'expense';

	const [loading, setLoading] = useState<boolean>(false);
	const [collapsed, setCollapsed] = useState<boolean>(true);
	const [accounts, setAccounts] = useState<schema.Account[]>([]);
	const [categories, setCategories] = useState<schema.Category[]>([]);

	// ---- form input state
	const [selectedAccount, setSelectedAccount] = useState<schema.Account>();
	const [selectedCategory, setSelectedCategory] = useState<schema.Category>();

	useEffect(() => {
		async function load() {
			try {
				const accounts = await drizzleDb.select().from(schema.accounts);
				const categories = await drizzleDb
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.type, transactionType));

				setAccounts(accounts);
				setSelectedAccount(accounts[0]);
				setCategories(categories);
				setSelectedCategory(categories[0]);
			} catch (error: any) {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			}
		}

		load();
	}, []);

	async function makePayment() {
		try {
			if (!selectedAccount || !selectedCategory) return;

			setLoading(true);
			// --- create a transaction record
			const payload: schema.Transaction = {
				amount: subscription.amount,
				account_id: Number(selectedAccount.id),
				category_id: Number(selectedCategory.id),
				created_at: toYYYYMMDD(new Date()),
				type: transactionType,
				image: '',
				note: `${subscription.name} subscriptions payment for ${new Date(subscription.due_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}`,
			};
			await drizzleDb
				.insert(schema.transactions)
				.values(payload)
				.onConflictDoNothing();

			// reduce the selected account balance
			await drizzleDb
				.update(schema.accounts)
				.set({ balance: selectedAccount?.balance - subscription.amount })
				.where(eq(schema.accounts.id, Number(selectedAccount.id)));

			// --- update the subscriptions due date
			if (subscription.billed === 'monthly') {
				const newDueDate = addMonths(new Date(subscription.due_date), 1);
				await drizzleDb
					.update(schema.subscriptions)
					.set({ due_date: toYYYYMMDD(newDueDate) });
			} else {
				const newDueDate = addYears(new Date(subscription.due_date), 1);
				await drizzleDb
					.update(schema.subscriptions)
					.set({ due_date: toYYYYMMDD(newDueDate) });
			}

			ToastAndroid.show('Created transaction record!', ToastAndroid.SHORT);
		} catch (error: any) {
			ToastAndroid.show(error.message, ToastAndroid.SHORT);
		} finally {
			setLoading(false);
			setCollapsed(true);
		}
	}

	return (
		<View style={{ gap: 8 }}>
			<View
				style={{
					gap: 8,
					borderTopWidth: 1,
					marginTop: 8,
					paddingTop: 6,
					borderColor: theme.colors.outlineVariant,
					borderStyle: 'dashed',
					display: collapsed ? 'none' : 'flex',
				}}
			>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Select account
				</Text>
				<AccountSelector
					accounts={accounts}
					handleSelect={setSelectedAccount}
					selectedAccount={selectedAccount}
				/>
			</View>

			<View
				style={{
					gap: 8,
					display: collapsed ? 'none' : 'flex',
					marginBottom: 16,
				}}
			>
				<Text style={styles.inputLabel} variant="bodyLarge">
					Category
				</Text>
				<SelectInputWithIcon
					data={categories}
					selectedCategory={selectedCategory}
					handleSelect={setSelectedCategory}
				/>
			</View>

			{collapsed ? (
				<Button
					onPress={() => setCollapsed(false)}
					mode="contained"
					contentStyle={{ padding: 8 }}
					style={{ borderRadius: 10 }}
					labelStyle={{ fontFamily: 'Inter-Medium', fontSize: 16 }}
				>
					Make payment
				</Button>
			) : (
				<View style={{ gap: 8 }}>
					<Button
						onPress={makePayment}
						mode="contained"
						contentStyle={{ padding: 8 }}
						style={{ borderRadius: 10 }}
						labelStyle={{ fontFamily: 'Inter-Medium', fontSize: 16 }}
					>
						{loading ? (
							<ActivityIndicator size={20} color={theme.colors.onPrimary} />
						) : (
							'Process payment'
						)}
					</Button>
					<Button
						onPress={() => setCollapsed(true)}
						mode="outlined"
						contentStyle={{ padding: 8 }}
						style={{ borderRadius: 10 }}
						labelStyle={{ fontFamily: 'Inter-Medium', fontSize: 16 }}
					>
						Cancel payment
					</Button>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	list: {
		flex: 1,
	},
	card: {
		padding: 16,
		marginHorizontal: 16,
		borderWidth: 1,
		borderRadius: 16,
		gap: 8,
		marginBottom: 12,
	},
	title: {
		fontFamily: 'Inter-Medium',
		marginBottom: 8,
	},
	amount: {
		fontFamily: 'Inter-Regular',
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	divider: {
		height: 1,
		width: '100%',
		maxWidth: 100,
	},
	detailContainer: {
		gap: 8,
		padding: 10,
		borderRadius: 13,
		borderWidth: 1,
	},
	detailRow: {
		flexDirection: 'row',
		gap: 8,
	},
	detailBox: {
		padding: 8,
		borderRadius: 8,
		borderWidth: 1,
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 6,
	},
	footerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 5,
	},
	text: {
		fontFamily: 'Inter-Regular',
		textAlign: 'center',
	},
	inputLabel: {
		fontFamily: 'Inter-Regular',
	},
});

