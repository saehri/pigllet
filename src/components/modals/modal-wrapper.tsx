import { X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';

type Props = {
	headerTitle: string;
	modalButton: ({ showModal }: { showModal: () => void }) => React.ReactNode;
	modalContent: () => React.ReactNode;
	initialState?: boolean;
};

export default function ModalWrapper({
	headerTitle,
	modalButton,
	initialState,
	modalContent,
}: Props) {
	const theme = useTheme();
	const [visible, setVisible] = useState<boolean>(initialState || false);

	const showModal = useCallback(() => setVisible(true), []);
	const hideModal = useCallback(() => setVisible(false), []);

	return (
		<>
			<Portal>
				<Modal visible={visible} onDismiss={hideModal} style={styles.modal}>
					<View
						style={[
							styles.modalContent,
							{
								backgroundColor: theme.colors.background,
								borderColor: theme.colors.outlineVariant,
							},
						]}
					>
						<View
							style={[
								styles.modalHeader,
								{ borderColor: theme.colors.outlineVariant },
							]}
						>
							<Text variant="titleMedium" style={styles.title}>
								{headerTitle}
							</Text>

							<Button onPress={hideModal} compact>
								<X size={20} color={theme.colors.onBackground} />
							</Button>
						</View>

						{modalContent()}
					</View>
				</Modal>
			</Portal>

			{modalButton({ showModal })}
		</>
	);
}

const styles = StyleSheet.create({
	modal: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(17, 17, 17, .3)',
	},
	modalContent: {
		width: Dimensions.get('screen').width,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		borderWidth: 1,
		borderBottomWidth: 0,
		bottom: -4,
	},
	modalHeader: {
		paddingLeft: 16,
		paddingTop: 12,
		paddingBottom: 8,
		paddingRight: 8,
		borderBottomWidth: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	title: {
		fontFamily: 'Inter-Regular',
		textTransform: 'capitalize',
	},
});
