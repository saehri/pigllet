import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function BalanceStats() {
    return (
        <View>
            <Text variant="bodyMedium" style={styles.title}>Your balance</Text>
            <Text
                variant="headlineLarge"
                style={styles.mainText}
            >
                Rp 5.500.000
            </Text>
            <Text variant="labelSmall" style={styles.caption}>
                This is the total money in all your wallets
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    title: {
        fontFamily: 'Inter-Regular'
    },
    mainText: {
        fontFamily: 'Inter-Black'
    },
    caption: {
        fontFamily: 'Inter-Light'
    }
})