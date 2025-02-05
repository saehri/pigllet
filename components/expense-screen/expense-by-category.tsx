import { ExpenseDataTypes } from '@/context/ExpensesProvider';
import { Text, View } from 'react-native';

interface ExpenseByCategory {
	data: ExpenseDataTypes[];
}

export default function ExpenseByCategory({ data }: ExpenseByCategory) {
	if (data.length === 0) {
		return (
			<View
				className="flex-1 w-full pb-8 px-6 bg-white gap-2"
				style={{ paddingTop: 16 }}
			>
				<View className="flex-row justify-between items-center">
					<Text
						className="text-slate-900 font-bold text-lg tracking-tight"
						style={{ fontWeight: 800 }}
					>
						Spending by category
					</Text>
				</View>

				<View className="p-6 border border-red-100 border-dashed rounded-xl">
					<Text className="text-center text-slate-500">
						No record found, let's create a new one!
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View className="px-6 pt-4">
			<Text className="tracking-tight text-lg font-bold mb-2 text-slate-900">
				Spending by category
			</Text>

			<View>
				{transformExpensesByCategory(data).map((data) => (
					<ListItem
						key={data.category}
						title={data.category}
						total={data.total}
					/>
				))}
			</View>
		</View>
	);
}

interface ListItem {
	title: string;
	total: number;
}

function ListItem({ title, total }: ListItem) {
	return (
		<View className="flex-row justify-between items-center py-2 w-full">
			<View className="flex-row gap-2 items-center">
				<View className="w-3 h-3 rounded-full bg-slate-900"></View>
				<Text className="text-lg text-slate-900">{title}</Text>
			</View>

			<Text className="text-lg text-slate-900">
				Rp {total.toLocaleString('id-ID')}
			</Text>
		</View>
	);
}

const transformExpensesByCategory = (
	expenses: ExpenseDataTypes[]
): { category: string; total: number }[] => {
	return Object.entries(
		expenses
			.filter((expense) => expense.transaction_type === 'spending')
			.reduce((acc, expense) => {
				const category = expense.category;
				if (category) {
					acc[category] = (acc[category] || 0) + expense.total;
				}
				return acc;
			}, {} as { [category: string]: number })
	).map(([category, total]) => ({ category, total }));
};
