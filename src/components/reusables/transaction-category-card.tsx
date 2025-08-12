import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { Category, TransactionType } from '@/db/schema';
import { TRANSACTION_CARD_BR, transactionColorMap } from '@/utils/utils';
import { CardPositionsTypes, TransactionIconsCatalogue } from '@/types/type';

import TransactionIcons from './transaction-icons';

type Props = {
	data: Category;
	position: CardPositionsTypes;
};

function TransactionCategoryCard({ data, position }: Props) {
	return (
		<Pressable>
			<Surface
				mode="flat"
				elevation={3}
				style={{
					borderTopLeftRadius: TRANSACTION_CARD_BR[position].tl,
					borderTopRightRadius: TRANSACTION_CARD_BR[position].tr,
					borderBottomLeftRadius: TRANSACTION_CARD_BR[position].bl,
					borderBottomRightRadius: TRANSACTION_CARD_BR[position].br,
					padding: 16,
					marginHorizontal: 16,
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					<TransactionIcons
						color={transactionColorMap[data.type as TransactionType]}
						icon={data.icon_name as keyof TransactionIconsCatalogue}
						size={24}
					/>
					<Text style={{ fontFamily: 'Manrope-Regular' }} variant="bodyMedium">
						{data.label}
					</Text>
				</View>
			</Surface>
		</Pressable>
	);
}

export default memo(TransactionCategoryCard);
