import { Dispatch, SetStateAction, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Select {
	selected: string;
	setSelected: Dispatch<SetStateAction<string>>;
	selectItems: string[];
}

import ArrowRightIcon from '@/assets/svg/arrow/keyboard-arrow-right.svg';
import ArrowDownIcon from '@/assets/svg/arrow/keyboard-arrow-down.svg';

export default function Select({ selected, setSelected, selectItems }: Select) {
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

	return (
		<View>
			<TouchableOpacity
				className="flex-row items-center justify-between w-auto p-2 px-4 border border-red-100 rounded-lg"
				onPress={() => setIsModalVisible(!isModalVisible)}
			>
				<Text className="text-slate-900 text-lg tracking-tight capitalize">
					{selected}
				</Text>

				{isModalVisible ? <ArrowDownIcon /> : <ArrowRightIcon />}
			</TouchableOpacity>

			{isModalVisible && (
				<View className="absolute bg-white border border-red-100 rounded-xl top-20 left-0 w-[175px] p-2 z-40 flex-row flex-wrap justify-between gap-1 shadow-xl">
					{selectItems.map((item) => (
						<TouchableOpacity
							key={item}
							className={`w-full p-2 rounded-lg ${
								selected === item
									? 'bg-[#FF4863] border-[#FF6A83] '
									: 'bg-white'
							}`}
							onPress={() => {
								setSelected(item);
								setIsModalVisible(false);
							}}
						>
							<Text
								className={`text-left text-lg capitalize ${
									selected === item ? 'text-white' : 'text-slate-600'
								}`}
							>
								{item}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
}
