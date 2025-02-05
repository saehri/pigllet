import { Text, View } from 'react-native';

interface Balance {
	balance: number;
}

export default function Balance({ balance }: Balance) {
	return (
		<View
			id="balance"
			className="px-6 flex-col gap-2"
			style={{ paddingTop: 28, paddingBottom: 28 }}
		>
			<Text className="text-slate-600">My balance</Text>

			<View className="flex-row gap-4">
				<Text className="text-5xl text-slate-900">
					Rp {balance.toLocaleString('id-ID')}
				</Text>
			</View>
		</View>
	);
}
