import { Button, Surface, useTheme } from 'react-native-paper';
import { ImageMinusIcon, ImagePlusIcon } from 'lucide-react-native';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Image, Dimensions } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

type Props = {
	noteValue: string;
	setNoteValue: Dispatch<SetStateAction<string>>;
	imageValue: string;
	setImageValue: Dispatch<SetStateAction<string>>;
};

function NoteInput({
	imageValue,
	noteValue,
	setImageValue,
	setNoteValue,
}: Props) {
	const theme = useTheme();
	const [isFocused, setFocused] = useState(false);

	const pickImage = async () => {
		if (imageValue.length) {
			return setImageValue('');
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			allowsMultipleSelection: false,
			base64: true,
			quality: 0.2,
		});

		if (!result.canceled) {
			setImageValue('data:image/png;base64,' + result.assets[0].base64);
		}
	};

	const imagePickerButtonRenderer = () => {
		if (imageValue.length)
			return (
				<ImageMinusIcon
					color={theme.colors.onSecondaryContainer}
					size={20}
					strokeWidth={1.5}
				/>
			);
		return (
			<ImagePlusIcon
				color={theme.colors.onSecondaryContainer}
				size={20}
				strokeWidth={1.5}
			/>
		);
	};

	return (
		<Surface
			mode="flat"
			elevation={5}
			style={[
				styles.container,
				{
					borderColor: isFocused
						? theme.colors.primary
						: theme.colors.outlineVariant,
				},
			]}
		>
			<View style={styles.row}>
				<TextInput
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					onChangeText={setNoteValue}
					value={noteValue}
					style={[styles.textInput, { color: theme.colors.onSurface }]}
					placeholderTextColor={theme.colors.outlineVariant}
					placeholder="Something special here"
				/>

				<Button
					mode="contained-tonal"
					compact
					style={{ borderRadius: 10, height: 40 }}
					onPress={pickImage}
				>
					{imagePickerButtonRenderer()}
				</Button>
			</View>

			<ImageRenderer imageValue={imageValue} />
		</Surface>
	);
}

type ImageRendererProps = {
	imageValue: string;
};

function ImageRenderer({ imageValue }: ImageRendererProps) {
	const theme = useTheme();
	const [imageHeight, setImageHeight] = useState(0);
	const [imageWidth, setImageWidth] = useState(0);

	useEffect(() => {
		function getBase64ImageSize(
			base64String: string
		): Promise<{ width: number; height: number }> {
			return new Promise((resolve, reject) => {
				Image.getSize(
					base64String,
					(width, height) => resolve({ width, height }),
					(error) => reject(error)
				);
			});
		}

		if (imageValue) {
			getBase64ImageSize(imageValue)
				.then(({ width, height }) => {
					setImageHeight(height);
					setImageWidth(width);
				})
				.catch((err) => console.error(err));
		}
	}, [imageValue]);

	const containerWidth = Dimensions.get('screen').width - 66;
	const imageRatio = imageHeight / imageWidth;

	if (imageValue.length)
		return (
			<View
				style={{
					width: '100%',
					height: imageRatio * containerWidth,
				}}
			>
				<Image
					source={{ uri: imageValue }}
					style={{
						flex: 1,
						objectFit: 'contain',
						marginBottom: 16,
						marginHorizontal: 16,
						backgroundColor: theme.colors.elevation.level1,
					}}
				/>
			</View>
		);

	return <View style={{ display: 'none' }}></View>;
}

const styles = StyleSheet.create({
	container: {
		gap: 8,
		borderWidth: 1,
		width: '100%',
		borderRadius: 16,
	},
	row: {
		alignItems: 'center',
		flexDirection: 'row',
		height: 50,
		width: '100%',
		padding: 8,
		paddingLeft: 16,
		paddingRight: 6,
		gap: 12,
	},
	leftComponentContainer: {
		height: 30,
		width: 30,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		borderWidth: 0.5,
	},
	textInput: {
		color: 'white',
		fontFamily: 'Manrope-Regular',
		fontSize: 16,
		flex: 1,
		height: '100%',
	},
});

export default memo(NoteInput);

