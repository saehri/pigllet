import { ImageDown, XCircle } from 'lucide-react-native';
import { Dispatch, SetStateAction } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

type Props = {
	handleSelect: Dispatch<SetStateAction<any>>;
	selectedImage: string;
};

export default function ImageSelectorInput({
	handleSelect,
	selectedImage,
}: Props) {
	const theme = useTheme();

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			allowsMultipleSelection: false,
			base64: true,
			quality: 0.5,
		});

		if (!result.canceled) {
			handleSelect('data:image/png;base64,' + result.assets[0].base64);
		}
	};

	return (
		<View>
			{selectedImage ? (
				<View>
					<Image
						source={{ uri: selectedImage }}
						style={{
							width: Dimensions.get('screen').width - 32,
							height: 300,
							borderRadius: 20,
							objectFit: 'contain',
							backgroundColor: theme.colors.elevation.level3,
						}}
					/>

					<Button
						onPress={() => handleSelect('')}
						mode="contained"
						compact
						style={{ position: 'absolute', top: 8, right: 8 }}
					>
						<XCircle size={20} color={theme.colors.onPrimary} />
					</Button>
				</View>
			) : (
				<Pressable
					onPress={pickImage}
					style={[
						styles.selectBox,
						{
							backgroundColor: theme.colors.surfaceVariant,
						},
					]}
				>
					<ImageDown
						style={styles.icon}
						size={20}
						color={theme.colors.onSurface}
					/>
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	selectBox: {
		padding: 16,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		minHeight: 60,
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
