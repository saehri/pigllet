import { useCallback, useState } from 'react';
import { Dialog, Portal } from 'react-native-paper';

type ActionTypes = {
	showDialog: () => void;
	hideDialog: () => void;
};

type Props = {
	dialogTrigger: ({ showDialog }: ActionTypes) => React.ReactNode;
	dialogContent: ({ hideDialog, showDialog }: ActionTypes) => React.ReactNode;
	initialState?: boolean;
};

export default function DialogWrapper({
	dialogTrigger,
	initialState,
	dialogContent,
}: Props) {
	const [visible, setVisible] = useState<boolean>(initialState || false);

	const showDialog = useCallback(() => setVisible(true), []);
	const hideDialog = useCallback(() => setVisible(false), []);

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={hideDialog}>
					<Dialog.Content>
						{dialogContent({ showDialog, hideDialog })}
					</Dialog.Content>
				</Dialog>
			</Portal>

			{dialogTrigger({ showDialog, hideDialog })}
		</>
	);
}
