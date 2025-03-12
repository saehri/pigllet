import { Dispatch, SetStateAction, useState } from 'react';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, ScrollView, View, StyleSheet } from 'react-native';
import { Dialog, Portal, Text, useTheme } from 'react-native-paper';

import SelectInputItem from './select-input-item';

type Props = {
	value: string;
	placeholder?: string;
	closeAfterSelect?: boolean;
	handleSelect: Dispatch<SetStateAction<any>>;
	triggerButton?: ({
		showDialog,
	}: {
		showDialog: () => void;
	}) => React.ReactNode;
	data: { value: string; label: string }[];
};

export default function SelectInput({
	placeholder,
	value,
	data,
	handleSelect,
	closeAfterSelect,
	triggerButton,
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
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={styles.listContainer}>
								{data.map((item) => (
									<SelectInputItem
										handleSelect={() => selectItem(item.value)}
										label={item.label}
										selected={value}
										value={item.value}
										key={item.value}
									/>
								))}
							</View>
						</ScrollView>
					</Dialog.Content>
				</Dialog>
			</Portal>

			{triggerButton ? (
				triggerButton({ showDialog })
			) : (
				<Pressable
					onPress={showDialog}
					style={[
						styles.selectBox,
						{
							backgroundColor: theme.colors.surfaceVariant,
							borderColor: visible
								? theme.colors.primary
								: theme.colors.outline,
						},
					]}
				>
					<Text style={styles.selectText} numberOfLines={1}>
						{value.replaceAll('-', ' ').replaceAll('and', '&') || placeholder}
					</Text>
					<ChevronDown
						style={styles.icon}
						size={20}
						color={theme.colors.onSurface}
					/>
				</Pressable>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	listContainer: {
		gap: 16,
	},
	itemContainer: {
		flexDirection: 'row',
		gap: 16,
		alignItems: 'center',
	},
	radioOuter: {
		width: 20,
		height: 20,
		borderRadius: 100,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioInner: {
		width: 11,
		height: 11,
		borderRadius: 1000,
	},
	itemText: {
		textTransform: 'capitalize',
	},
	selectBox: {
		padding: 16,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	selectText: {
		fontFamily: 'Inter-Regular',
		fontSize: 16,
		color: '#fff',
		textTransform: 'capitalize',
	},
	icon: {
		position: 'absolute',
		right: 8,
	},
});
