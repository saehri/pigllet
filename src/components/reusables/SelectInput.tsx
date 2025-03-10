import { Dispatch, SetStateAction, useState } from 'react';
import { ChevronDown } from 'lucide-react-native';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { Dialog, Portal, Text, useTheme } from 'react-native-paper';

type Props = {
	placeholder: string;
	value: string;
	data: { value: string; label: string }[];
	handleSelect: Dispatch<SetStateAction<any>>;
	closeAfterSelect?: boolean;
};

export default function SelectInput({
	placeholder,
	value,
	data,
	handleSelect,
	closeAfterSelect,
}: Props) {
	const theme = useTheme();
	const [visible, setVisible] = useState<boolean>(false);

	const showDialog = () => setVisible(true);
	const hideDialog = () => setVisible(false);

	function selectItem(selected: string) {
		handleSelect(selected);
		if (closeAfterSelect) hideDialog();
	}

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={hideDialog}>
					<Dialog.Content>
						<ScrollView>
							<View style={{ gap: 10 }}>
								{data.map((item) => (
									<Pressable
										key={item.value}
										style={{
											flexDirection: 'row',
											gap: 16,
											alignItems: 'center',
										}}
										onPress={() => selectItem(item.value)}
									>
										<View
											style={{
												width: 20,
												height: 20,
												borderRadius: 100,
												borderWidth: 1,
												borderColor: theme.colors.outline,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<View
												style={{
													display: value === item.value ? 'flex' : 'none',
													width: 11,
													height: 11,
													backgroundColor: theme.colors.primary,
													borderRadius: 1000,
												}}
											></View>
										</View>

										<Text
											variant="bodyLarge"
											style={{ textTransform: 'capitalize' }}
										>
											{item.label}
										</Text>
									</Pressable>
								))}
							</View>
						</ScrollView>
					</Dialog.Content>
				</Dialog>
			</Portal>

			<Pressable
				onPress={showDialog}
				style={{
					backgroundColor: theme.colors.surfaceVariant,
					padding: 16,
					borderTopLeftRadius: 5,
					borderTopRightRadius: 5,
					borderBottomWidth: 1,
					borderColor: visible ? theme.colors.primary : theme.colors.outline,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Text
					style={{
						fontFamily: 'Inter-Regular',
						fontSize: 16,
						color: '#fff',
						textTransform: 'capitalize',
					}}
				>
					{value || placeholder}
				</Text>

				<ChevronDown size={20} color={theme.colors.onSurface} />
			</Pressable>
		</>
	);
}
