import { View } from 'react-native';

import BalanceStats from './balance-stats';
import WidgetWrapper from '../reusables/widget-wrapper';
import IncomeExpenseStats from './income-expense-stats';

export default function AccountOverviewWidget() {
	return (
		<WidgetWrapper
			title="Overview"
			customStyle={{ marginHorizontal: 16, marginBottom: 5 }}
		>
			<BalanceStats />

			<View style={{ marginTop: 16, flexDirection: 'row', gap: 8, flex: 1 }}>
				<IncomeExpenseStats label='Income' />
				<IncomeExpenseStats label='Expense' />
			</View>
		</WidgetWrapper>
	);
}