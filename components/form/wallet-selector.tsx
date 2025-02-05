import { Dispatch, SetStateAction } from 'react';
import { ScrollView, TouchableHighlight } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';

interface WalletSelector {
	selectedWallet: { wallet_id: number; wallet_name: string };
	setSelectedWallet: Dispatch<
		SetStateAction<{ wallet_id: number; wallet_name: string }>
	>;
}

export default function WalletSelector(props: WalletSelector) {
	const wallets: { wallet_id: number; wallet_name: string }[] = [
		{ wallet_id: 1, wallet_name: 'Cash' },
	];

	return (
		<View className="gap-2">
			<Text className="text-slate-900 tracking-tight ml-6">
				Select your wallet
			</Text>

			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View className="flex-row gap-2 px-6">
					{wallets.map((wallet) => (
						<TouchableHighlight
							key={wallet.wallet_id}
							onPress={() => props.setSelectedWallet(wallet)}
							className="rounded-xl"
						>
							<View className="bg-slate-900 rounded-xl p-3 justify-between overflow-hidden h-20 w-36 relative">
								<Text className="text-white text-sm">{wallet.wallet_name}</Text>

								<Text className="text-white"></Text>

								{props.selectedWallet.wallet_id === wallet.wallet_id && (
									<Text className="absolute bg-green-600 text-white px-2 top-2 right-2 rounded-xl text-xs">
										Selected
									</Text>
								)}
							</View>
						</TouchableHighlight>
					))}
				</View>
			</ScrollView>
		</View>
	);
}
