import { useRouter } from "expo-router";
import { ChevronRightIcon } from "lucide-react-native";
import { useMemo } from "react";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Surface, Text, useTheme } from "react-native-paper";

import { useAccountStore } from "@/store/useAccountStore";
import { useStatisticStore } from "@/store/useStatisticStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { groupedTransactionsByDate } from "@/utils/group-transactions";
import { getCardPosition } from "@/utils/utils";

import NoItemNotice from "@/src/components/reusables/no-items-notice";
import TransactionCard from "@/src/components/reusables/transaction-card";

export default function WeekTransactionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { accounts } = useAccountStore();
  const { transactions } = useTransactionStore();
  const { balanceInAllAccounts } = useStatisticStore();

  const groupedData = useMemo(() => {
    if (!transactions?.length) return [];

    return groupedTransactionsByDate(
      transactions.slice(0, 20) as any,
      "MMM D, YYYY",
    );
  }, [transactions]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, height: 280 }}>
        <Surface
          mode="flat"
          elevation={5}
          style={{
            padding: 16,
            borderRadius: 24,
            minHeight: 200,
            justifyContent: "space-between",
          }}
        >
          <Image
            source={require("@/assets/images/cards/sun-shape.png")}
            style={{
              width: 60,
              height: 60,
              position: "absolute",
              top: 16,
              left: 16,
            }}
          />

          <View
            style={{
              padding: 5,
              borderRadius: 1000,
              backgroundColor: theme.colors.primary,
              position: "absolute",
              bottom: 11,
              right: 11,
              zIndex: 2,
            }}
          >
            <Image
              source={require("@/assets/images/cards/wallet-shape.png")}
              style={{
                width: 60,
                height: 60,
              }}
            />
          </View>

          <Text
            style={{
              fontFamily: "GSans",
              color: "#111",
              alignSelf: "flex-end",
            }}
            variant="bodyLarge"
          >
            **** 9989
          </Text>

          <Text
            style={{ fontFamily: "GSans", color: "#111" }}
            variant="displaySmall"
            numberOfLines={1}
          >
            Main Account
          </Text>
        </Surface>

        <ScrollView
          horizontal
          contentContainerStyle={{ paddingVertical: 16, gap: 2 }}
        >
          <Surface
            mode="flat"
            elevation={5}
            style={{
              justifyContent: "center",
              paddingHorizontal: 10,
              borderRadius: 1000,
              width: 120,
              backgroundColor: theme.colors.secondary,
            }}
          >
            <Image
              source={require("@/assets/images/cards/wallet-shape.png")}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Surface>
          <Surface
            mode="flat"
            elevation={5}
            style={{
              justifyContent: "center",
              paddingHorizontal: 10,
              borderRadius: 1000,
              width: 120,
              backgroundColor: theme.colors.secondary,
            }}
          >
            <Image
              source={require("@/assets/images/cards/wallet-shape.png")}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Surface>
          <Surface
            mode="flat"
            elevation={5}
            style={{
              justifyContent: "center",
              paddingHorizontal: 10,
              borderRadius: 1000,
              width: 120,
              backgroundColor: theme.colors.secondary,
            }}
          >
            <Image
              source={require("@/assets/images/cards/wallet-shape.png")}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Surface>
          <Surface
            mode="flat"
            elevation={5}
            style={{
              justifyContent: "center",
              paddingHorizontal: 10,
              borderRadius: 1000,
              width: 120,
              backgroundColor: theme.colors.secondary,
            }}
          >
            <Image
              source={require("@/assets/images/cards/wallet-shape.png")}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Surface>
        </ScrollView>
      </View>

      <Surface elevation={1} mode="flat" style={styles.transactionRow}>
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          ListHeaderComponent={() => (
            <View style={styles.transactionRowHeader}>
              <Text variant="titleLarge" style={styles.transactionsTitle}>
                Transactions
              </Text>

              <Button
                mode="text"
                labelStyle={{ fontFamily: "GSans" }}
                contentStyle={{ flexDirection: "row-reverse" }}
              >
                See all
              </Button>
            </View>
          )}
          data={groupedData}
          ListEmptyComponent={<NoItemNotice />}
          renderItem={({ item }) => (
            <View
              style={styles.transactionListContainer}
              key={item.created_date}
            >
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
          )}
        />
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsTitle: {
    fontFamily: "GSans",
    marginVertical: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
  },
  transactionRow: {
    paddingTop: 0,
    flex: 1,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    borderWidth: 0,
  },
  transactionRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingRight: 12,
  },
  transactionListTitle: {
    fontFamily: "GSans",
    opacity: 0.7,
    marginBottom: 4,
  },
  transactionListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
});
