import { Ellipsis, ShoppingBasket } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

export default function BudgetCard() {
    const theme = useTheme();

    return (
        <Surface
            mode="flat"
            elevation={4}
            style={[styles.surface]}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={styles.header}>
                    <ShoppingBasket size={20} color={theme.colors.onBackground} />

                    <Text variant="titleMedium" style={styles.title}>
                        Groceries
                    </Text>
                </View>

                <Button compact mode='text'>
                    <Ellipsis size={20} color={theme.colors.onBackground} />
                </Button>
            </View>

            <View style={styles.content}>
                <View style={styles.budgetInfo}>
                    <Text variant="labelMedium" style={styles.label}>
                        Rp 0
                    </Text>
                    <Text variant="labelMedium" style={styles.label}>
                        Rp 1.000.000
                    </Text>
                </View>

                <View style={[styles.progressBar, { backgroundColor: theme.colors.secondaryContainer }]}>
                    <View style={[styles.progress, { width: '50%', backgroundColor: theme.colors.primary }]}></View>
                </View>

                <Text style={styles.description}>
                    You already spent Rp 500.000 in this category.
                </Text>
            </View>
        </Surface>
    );
}

const styles = StyleSheet.create({
    surface: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Inter-Bold',
    },
    content: {
        gap: 12,
    },
    budgetInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: 0.8,
    },
    label: {
        fontFamily: 'Inter-Regular',
    },
    progressBar: {
        flex: 1,
        height: 6,
        borderRadius: 100,
    },
    progress: {
        height: 6,
        borderRadius: 100,
    },
    description: {
        fontFamily: 'Inter-Light',
    },
});
