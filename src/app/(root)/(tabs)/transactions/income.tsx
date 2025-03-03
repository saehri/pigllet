import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import TransactionCard from '@/src/components/reusables/transaction-card';

export default function IncomeScreen(props: any) {
    const theme = useTheme();

    const [value, setValue] = useState<string>('expense');

    const dataDummy = {
        income: [
            { title: '12 Feb 2025', data: [{ type: 'income' }, { type: 'income' }] },
            { title: '11 Feb 2025', data: [{ type: 'income' }, { type: 'income' }] },
            { title: '6 Feb 2025', data: [{ type: 'income' }, { type: 'income' }] },
            { title: '5 Feb 2025', data: [{ type: 'income' }, { type: 'income' }] },
            { title: '4 Feb 2025', data: [{ type: 'income' }, { type: 'income' }] },
            { title: '1 Feb 2025', data: [{ type: 'income' }, { type: 'income' }] },
        ],
        transfer: [
            {
                title: '4 Feb 2025',
                data: [{ type: 'transfer' }, { type: 'transfer' }],
            },
            {
                title: '1 Feb 2025',
                data: [{ type: 'transfer' }, { type: 'transfer' }],
            },
        ],
        expense: [
            {
                title: '13 Feb 2025',
                data: [
                    { type: 'expense' },
                    { type: 'expense' },
                    { type: 'expense' },
                    { type: 'expense' },
                    { type: 'expense' },
                    { type: 'expense' },
                    { type: 'expense' },
                    { type: 'expense' },
                    { type: 'expense' },
                ],
            },
            {
                title: '12 Feb 2025',
                data: [
                    { type: 'expense' },
                    { type: 'expense' },
                    { type: 'expense' },
                    { type: 'expense' },
                ],
            },
            {
                title: '11 Feb 2025',
                data: [{ type: 'expense' }, { type: 'expense' }],
            },
            {
                title: '10 Feb 2025',
                data: [{ type: 'expense' }, { type: 'expense' }, { type: 'expense' }],
            },
            { title: '9 Feb 2025', data: [{ type: 'expense' }, { type: 'expense' }] },
            { title: '8 Feb 2025', data: [{ type: 'expense' }, { type: 'expense' }] },
            { title: '7 Feb 2025', data: [{ type: 'expense' }, { type: 'expense' }] },
            { title: '6 Feb 2025', data: [{ type: 'expense' }, { type: 'expense' }] },
            { title: '5 Feb 2025', data: [{ type: 'expense' }, { type: 'expense' }] },
            { title: '4 Feb 2025', data: [{ type: 'expense' }, { type: 'expense' }] },
            { title: '3 Feb 2025', data: [{ type: 'expense' }, { type: 'expense' }] },
            { title: '2 Feb 2025', data: [{ type: 'expense' }, { type: 'expense' }] },
            { title: '1 Feb 2025', data: [{ type: 'expense' }, { type: 'expense' }] },
        ],
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: theme.colors.background }}>
            <SectionRender data={dataDummy['income']} />
        </ScrollView>
    );
}

function SectionRender(props: {
    data: { title: string; data: { type: any }[] }[];
}) {
    return (
        <View style={{ gap: 16, marginTop: 75 }}>
            {props.data.map((data, index) => (
                <View key={index}>
                    <Text
                        variant="titleMedium"
                        style={{ marginHorizontal: 16, fontFamily: 'Inter-Black' }}
                    >
                        {data.title}
                    </Text>

                    {data.data.map((data, index) => (
                        <TransactionCard key={index + data.type} type={data.type} />
                    ))}
                </View>
            ))}
        </View>
    );
}
