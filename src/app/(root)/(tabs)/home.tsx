import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { StyleSheet, View } from "react-native";
import { useCallback, useMemo, useState } from "react";
import { ChevronRightIcon } from "lucide-react-native";
import { Button, FAB, Text, useTheme } from "react-native-paper";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

import useScrollDirection from "@/src/hooks/useScrollDirection";
import { useAccountStore } from "@/store/useAccountStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { fastSpatialEasing, getCardPosition } from "@/utils/utils";
import { groupedTransactionsByDate } from "@/utils/group-transactions";

import NoItemNotice from "@/src/components/reusables/no-items-notice";
import TransactionCard from "@/src/components/reusables/transaction-card";

export default function WeekTransactionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { accounts } = useAccountStore();
  const { transactions } = useTransactionStore();
  const { direction, handleScroll } = useScrollDirection();

  const groupedData = useMemo(() => {
    if (!transactions?.length) return [];

    return groupedTransactionsByDate(transactions as any, "MMM D, YYYY");
  }, [transactions]); // Only recalculates when the 'transactions' array changes

  const renderTransactionGroup = () => {
    if (!groupedData.length) {
      return <NoItemNotice />;
    }

    return groupedData.map((item) => (
      <View style={styles.transactionListContainer} key={item.created_date}>
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
    ));
  };

  const renderFab = useCallback(() => {
    if (direction === "up")
      return (
        <Animated.View
          entering={FadeInDown.duration(500).easing(fastSpatialEasing)}
          exiting={FadeOutDown.duration(500).easing(fastSpatialEasing)}
        >
          <FAB
            icon="plus"
            size="medium"
            mode="flat"
            style={styles.fab}
            onPress={() => router.push("/(root)/new-transactions/expense")}
            variant="secondary"
          />
        </Animated.View>
      );

    return <></>;
  }, [direction]);

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        onScroll={handleScroll}
      >
        <View
          style={{
            padding: 16,
            paddingTop: 0,
            backgroundColor: theme.colors.elevation.level3,
            flex: 1,
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text variant="titleLarge" style={styles.transactionsTitle}>
              Transactions
            </Text>

            <Button
              compact
              mode="text"
              icon={(props) => (
                <ChevronRightIcon
                  size={props.size}
                  color={props.color}
                  strokeWidth={1.5}
                />
              )}
              labelStyle={{ fontFamily: "GSans" }}
              contentStyle={{ flexDirection: "row-reverse" }}
            >
              More
            </Button>
          </View>

          {renderTransactionGroup()}
        </View>
      </ScrollView>

      {renderFab()}
    </>
  );
}

const styles = StyleSheet.create({
  transactionListTitle: {
    fontFamily: "GSans",
    opacity: 0.7,
    marginBottom: 4,
  },
  transactionsTitle: {
    fontFamily: "GSans",
    marginVertical: 16,
  },
  transactionListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
  },
});
