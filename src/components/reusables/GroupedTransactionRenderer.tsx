import { Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

import { getCardPosition } from "@/utils/utils";
import { GroupedTransactionByDateOutput } from "@/utils/group-transactions";

import NoItemNotice from "./no-items-notice";
import TransactionCard from "./transaction-card";

type Props = {
  data: GroupedTransactionByDateOutput[];
};

export default function GroupedTransactionRenderer({ data }: Props) {
  if (!data.length) {
    return <NoItemNotice />;
  }

  return data.map((item) => (
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
}

const styles = StyleSheet.create({
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
