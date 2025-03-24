import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { Check, ChevronDown } from 'lucide-react-native';

import TransactionIcons from '../reusables/transaction-icons';

interface SelectInputWithIcon {
	data: any;
	selectedCategory: any;
	handleSelect: (selected: any) => void;
}

export default function SelectInputWithIcon({
	handleSelect,
	data,
	selectedCategory,
}: SelectInputWithIcon) {
	const theme = useTheme();
	const [visible, setVisible] = useState<boolean>(false);

	const showDialog = () => setVisible(true);
	const hideDialog = () => setVisible(false);

	function selectItem(selected: any) {
		handleSelect(selected);
		hideDialog();
	}

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={hideDialog}>
					<Dialog.Content>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View>
								{data.map((c: any) => (
									<Pressable
										key={c.id}
										style={{
											padding: 16,
											borderRadius: 20,
											flexDirection: 'row',
											gap: 16,
											alignItems: 'center',
											backgroundColor:
												c.id === selectedCategory.id
													? theme.colors.elevation.level5
													: theme.colors.elevation.level3,
										}}
										onPress={() => selectItem(c)}
									>
										<TransactionIcons icon={c.icon_name as any} />

										<Text
											variant="bodyLarge"
											style={{ fontFamily: 'Inter-Regular' }}
										>
											{c.label}
										</Text>

										{c.id === selectedCategory.id && (
											<Check
												size={16}
												color={theme.colors.onSurface}
												style={{ position: 'absolute', right: 16 }}
											/>
										)}
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
					padding: 16,
					borderTopLeftRadius: 5,
					borderTopRightRadius: 5,
					borderBottomWidth: 1,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					backgroundColor: theme.colors.surfaceVariant,
					borderColor: visible ? theme.colors.primary : theme.colors.outline,
				}}
			>
				<Text
					style={{
						fontFamily: 'Inter-Regular',
						fontSize: 16,
						color: '#fff',
						textTransform: 'capitalize',
					}}
					numberOfLines={1}
				>
					{selectedCategory ? selectedCategory.label : 'Other'}
				</Text>

				<ChevronDown
					style={{
						position: 'absolute',
						right: 8,
					}}
					size={20}
					color={theme.colors.onSurface}
				/>
			</Pressable>
		</>
	);
}
