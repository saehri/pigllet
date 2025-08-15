import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import {
	FlatList,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import * as schema from '@/db/schema';
import { Surface, Text, useTheme } from 'react-native-paper';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';
import { useSelectedTransactions } from '@/store/useSelectedTransactions';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';
import { formatCurrencyByCode, getCardPosition } from '@/utils/utils';
import { groupedTransactionsByDate } from '@/utils/group-transactions';

import HeaderBar from '@/src/components/home/header-bar';
import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import AccountCardPreview from '@/src/components/reusables/account-card-preview';

export default function AccountsSettingScreen() {
	const db = useSQLiteContext();
	const drizzleDb = drizzle(db, { schema });
	const setSelectedTransactions = useSelectedTransactions(
		(s) => s.setSelectedTransactions
	);

	const [selectedAccount, setSelectedAccount] = useState<schema.Account>();

	const { data: accounts } = useLiveQuery(
		drizzleDb.select().from(schema.accounts)
	);

	useFocusEffect(
		useCallback(() => {
			return () => {
				setSelectedTransactions([]);
			};
		}, [])
	);

	return (
		<View style={{ flex: 1 }}>
			<CardSelector
				accounts={accounts}
				selectedAccount={selectedAccount!}
				setSelectedAccount={setSelectedAccount as any}
			/>

			<TransactionList accountId={selectedAccount?.id || 0} />
		</View>
	);
}

interface TransactionList {
	accountId: number;
}

function TransactionList({ accountId }: TransactionList) {
	const { data: transactions } = useLiveQuery(
		loadTransactionsData({
			accountId,
		}),
		[accountId]
	);

	const renderTransactionGroup = useCallback(
		({ item }: any) => (
			<View style={styles.transactionListContainer}>
				<Text style={styles.transactionListTitle} variant="bodySmall">
					{item.created_date}
				</Text>
				<View style={{ gap: 2 }}>
					{item.transactions.map((data: any, index: number) => (
						<TransactionCard
							key={data.transaction.id}
							data={data}
							showDate={false}
							position={getCardPosition(index, item.transactions.length)}
						/>
					))}
				</View>
			</View>
		),
		[]
	);

	return (
		<Surface
			mode="flat"
			elevation={1}
			style={{
				borderTopLeftRadius: 32,
				borderTopRightRadius: 32,
				gap: 8,
				flex: 1,
			}}
		>
			<View style={{ paddingHorizontal: 16 }}>
				<HeaderBar />
			</View>

			<FlatList
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={<NoItemNotice />}
				data={groupedTransactionsByDate(transactions, 'MMM DD, YYYY')}
				renderItem={renderTransactionGroup}
			/>
		</Surface>
	);
}

interface CardSelector {
	accounts: schema.Account[];
	selectedAccount: schema.Account;
	setSelectedAccount: Dispatch<SetStateAction<schema.Account>>;
}

function CardSelector({
	accounts,
	selectedAccount,
	setSelectedAccount,
}: CardSelector) {
	const theme = useTheme();
	const currentCurrencyCode = usePreferredCurrencyStore(
		(s) => s.currentCurrencyCode
	);

	useEffect(() => {
		if (!selectedAccount) {
			setSelectedAccount(accounts[0]);
		}
	}, [accounts]);

	return (
		<View style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 24 }}>
			<AccountCardPreview
				accountHolder={selectedAccount?.card_holder || ''}
				accountName={selectedAccount?.card_name || ''}
				accountNumber={selectedAccount?.card_number || ''}
				cardColor={selectedAccount?.card_color}
			/>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{accounts?.map((account) => {
					const isSelected = selectedAccount?.id === account.id;

					return (
						<Pressable
							key={account.id}
							onPress={() => setSelectedAccount(account)}
							style={[
								styles.card,
								{
									borderColor: isSelected
										? selectedAccount?.card_color
										: theme.colors.elevation.level5,
								},
							]}
						>
							<View
								style={[
									styles.cardContent,
									{
										backgroundColor: account.card_color,
									},
								]}
							>
								<Text style={styles.text}>{account.card_name}</Text>

								<Text style={styles.text}>
									{formatCurrencyByCode(account.balance, currentCurrencyCode)}
								</Text>

								<Image
									source={require('@/assets/images/cards/pig pattern.png')}
									style={styles.bgImage}
								/>
							</View>
						</Pressable>
					);
				})}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	transactionListTitle: {
		fontFamily: 'Manrope-Light',
		opacity: 0.7,
	},
	transactionListContainer: {
		paddingHorizontal: 16,
		paddingBottom: 12,
		gap: 8,
	},
	scrollContent: {
		gap: 10,
	},
	card: {
		padding: 2,
		height: 80,
		width: 150,
		justifyContent: 'space-between',
		borderWidth: 2,
		borderRadius: 14,
	},
	text: {
		fontFamily: 'Manrope-Regular',
		color: 'white',
		zIndex: 2,
	},
	bgImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 150,
		height: 95,
		resizeMode: 'cover',
		zIndex: 0,
	},
	cardContent: {
		justifyContent: 'space-between',
		flex: 1,
		borderRadius: 10,
		padding: 8,
		overflow: 'hidden',
	},
});

