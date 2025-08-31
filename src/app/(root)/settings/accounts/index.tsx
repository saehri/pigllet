import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react';
import {
	FlatList,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { PencilIcon, PlusIcon } from 'lucide-react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import * as schema from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDrizzleDB } from '@/src/hooks/useDrizzleDb';

import { formatCurrencyByCode, getCardPosition } from '@/utils/utils';
import { groupedTransactionsByDate } from '@/utils/group-transactions';
import { useSelectedTransactions } from '@/store/useSelectedTransactions';
import { loadTransactionsData } from '@/src/hooks/useTransactionsManager';
import { usePreferredCurrencyStore } from '@/store/usePreferredCurrencyStore';

import NoItemNotice from '@/src/components/reusables/no-items-notice';
import TransactionCard from '@/src/components/reusables/transaction-card';
import TransactionHeaderBar from '@/src/components/home/transaction-header-bar';
import AccountCardPreview from '@/src/components/reusables/account-card-preview';

export default function AccountsSettingScreen() {
	const theme = useTheme();
	const router = useRouter();
	const navigation = useNavigation();

	const drizzleDb = useDrizzleDB();
	const { data: accounts } = useLiveQuery(
		drizzleDb.select().from(schema.accounts)
	);

	const setSelectedTransactions = useSelectedTransactions(
		(s) => s.setSelectedTransactions
	);

	const [selectedAccount, setSelectedAccount] = useState<schema.Account>();

	useEffect(() => {
		navigation.setOptions({
			title: 'My accounts',
			headerRight: () => (
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						gap: 2,
					}}
				>
					<Button
						mode="contained-tonal"
						compact
						style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}
						contentStyle={{ height: 40 }}
						onPress={() =>
							router.push({
								pathname: '/(root)/settings/accounts/edit-account',
								params: { accountId: selectedAccount?.id },
							})
						}
					>
						<PencilIcon
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
							size={20}
						/>
					</Button>
					<Button
						mode="contained-tonal"
						compact
						style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
						contentStyle={{ height: 40 }}
						onPress={() => router.push('/(root)/settings/accounts/add-account')}
					>
						<PlusIcon
							strokeWidth={1.5}
							color={theme.colors.onSecondaryContainer}
							size={20}
						/>
					</Button>
				</View>
			),
		});
	}, [selectedAccount]);

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

	const renderer = () => {
		if (accountId)
			return (
				<Animated.View
					entering={FadeInDown.delay(500)
						.springify()
						.mass(1)
						.damping(10)
						.stiffness(100)}
					style={{ flex: 1 }}
				>
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
							<TransactionHeaderBar />
						</View>

						<FlatList
							showsVerticalScrollIndicator={false}
							ListEmptyComponent={<NoItemNotice />}
							data={groupedTransactionsByDate(
								transactions as any,
								'MMM DD, YYYY'
							)}
							renderItem={renderTransactionGroup}
						/>
					</Surface>
				</Animated.View>
			);

		return <></>;
	};

	return <View style={{ flex: 1 }}>{renderer()}</View>;
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
	const { currentCurrencyCode, showFraction, accountingStyle } =
		usePreferredCurrencyStore();

	useEffect(() => {
		setSelectedAccount(accounts[0]);
	}, [accounts]);

	const accountCardPrevRenderer = useCallback(() => {
		if (accounts.length)
			return (
				<AccountCardPreview
					animationKey={selectedAccount.id}
					isDefault={Boolean(selectedAccount.is_default)}
					accountHolder={selectedAccount?.card_holder || ''}
					accountName={selectedAccount?.card_name || ''}
					accountNumber={selectedAccount?.card_number || ''}
					cardColor={selectedAccount?.card_color}
				/>
			);
		return <></>;
	}, [selectedAccount]);

	return (
		<View
			style={{
				paddingTop: 10,
				paddingBottom: 16,
				flex: 0.85,
				gap: 16,
			}}
		>
			<View style={{ paddingHorizontal: 30, maxWidth: 400 }}>
				{accountCardPrevRenderer()}
			</View>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{accounts?.map((account, index) => {
					const isSelected = selectedAccount?.id === account.id;
					const delayDuration = 500 + index * 100;

					return (
						<Animated.View
							key={account.id}
							entering={FadeInRight.delay(delayDuration)}
						>
							<Pressable
								onPress={() => setSelectedAccount(account)}
								style={[
									styles.card,
									{
										borderColor: isSelected
											? selectedAccount?.card_color
											: theme.colors.background,
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
										{formatCurrencyByCode(
											account.balance,
											currentCurrencyCode,
											showFraction,
											accountingStyle
										)}
									</Text>

									<Image
										source={require('@/assets/images/cards/pig pattern.png')}
										style={styles.bgImage}
									/>
								</View>
							</Pressable>
						</Animated.View>
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
		height: 82,
		paddingHorizontal: 30,
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
		opacity: 0.3,
	},
	cardContent: {
		justifyContent: 'space-between',
		flex: 1,
		borderRadius: 10,
		padding: 8,
		overflow: 'hidden',
	},
});

