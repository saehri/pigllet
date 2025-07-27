import { useState } from 'react';

import { CalendarFoldIcon } from 'lucide-react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

export default function MonthYearSelectorDialog() {
	const theme = useTheme();

	const [visible, setVisible] = useState<boolean>(false);

	const openDialog = () => setVisible(true);
	const closeDialog = () => setVisible(false);

	return (
		<>
			<Portal>
				<Dialog visible={visible} onDismiss={closeDialog}>
					<Dialog.Title
						style={{
							fontFamily: 'Manrope-Medium',
							letterSpacing: -0.2,
							fontSize: 20,
						}}
					>
						Pick the month and year
					</Dialog.Title>
					<Dialog.Content>
						<Text
							style={{ fontFamily: 'Manrope-Regular' }}
							variant="bodyMedium"
						>
							This action cannot be undone
						</Text>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={closeDialog}
							labelStyle={{ fontFamily: 'Manrope-Regular' }}
						>
							Cancel
						</Button>

						<Button labelStyle={{ fontFamily: 'Manrope-Regular' }}>Ok</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>

			<Button
				mode="contained-tonal"
				onPress={openDialog}
				contentStyle={{ height: 40 }}
				icon={(props) => (
					<CalendarFoldIcon
						size={props.size}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			>
				July, 2025
			</Button>
		</>
	);
}

