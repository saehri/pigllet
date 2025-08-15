import { PaletteIcon } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';
import { Dispatch, memo, SetStateAction, useState } from 'react';
import { Button, Dialog, Portal, useTheme } from 'react-native-paper';
import CPicker, { Preview, Panel1, HueSlider } from 'reanimated-color-picker';

type Props = {
	setCardColor: Dispatch<SetStateAction<string>>;
};

function ColorPicker({ setCardColor }: Props) {
	const theme = useTheme();

	const [showDialog, setShowDialog] = useState(false);
	const [selectedColor, setSelectedColor] = useState<string>('red'); // default color

	const onSelectColor = ({ hex }: { hex: string }) => {
		setSelectedColor(hex);
	};

	const openDialog = () => setShowDialog(true);
	const closeDialog = () => setShowDialog(false);

	const handleSelect = () => {
		setCardColor(selectedColor);
		closeDialog();
	};

	return (
		<>
			<Pressable
				onPress={openDialog}
				style={[
					styles.buttonTrigger,
					{
						backgroundColor: theme.colors.elevation.level5,
						borderColor: showDialog
							? theme.colors.primary
							: theme.colors.elevation.level5,
					},
				]}
			>
				<PaletteIcon size={20} color={theme.colors.onSurface} />
			</Pressable>

			<Portal>
				<Dialog visible={showDialog} onDismiss={closeDialog}>
					<Dialog.Content
						style={{
							justifyContent: 'space-between',
							gap: 24,
							alignItems: 'center',
						}}
					>
						<CPicker
							style={{ width: '70%', gap: 16 }}
							value={selectedColor}
							onCompleteJS={onSelectColor}
						>
							<Preview hideInitialColor />
							<Panel1 />
							<HueSlider />
						</CPicker>
					</Dialog.Content>

					<Dialog.Actions>
						<Button onPress={closeDialog}>Cancel</Button>
						<Button onPress={handleSelect}>Select color</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
}

export default memo(ColorPicker);

const styles = StyleSheet.create({
	buttonTrigger: {
		width: 40,
		height: 40,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
	},
});

