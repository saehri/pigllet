import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import AddPhotoAlternateIcon from '@/assets/svg/add_photo_alternate_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import TextCompareIcon from '@/assets/svg/text_compare_24dp_E8EAED_FILL0_wght300_GRAD0_opsz24.svg';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';

export default function RecieptOCR() {
	const [image, setImage] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [scanResult, setScanResult] = useState();

	const pickImage = async () => {
		// Request permission to access media library
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('Sorry, we need media library permissions to make this work!');
			return;
		}

		// Open the image picker
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
			allowsEditing: true, // Allow users to crop the image
			quality: 1, // Image quality (1 = highest)
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri); // Set the selected image URI
		}
	};

	async function scanImage() {
		try {
			const formData = new FormData();

			formData.append('file', {
				uri: image,
				type: 'image/jpeg', // Set the MIME type to match your image format
				name: 'image.jpg',
			});

			const response = await axios.post(
				'https://pigllet-backend.vercel.app/api/ocr/scan',
				formData,
				{
					headers: {
						'content-type': 'multipart/form-data',
					},
					transformRequest: (data: unknown) => data,
				}
			);

			return response.data; // Assuming the API returns { id: 'some-id' }
		} catch (error: any) {
			console.error('Error in scanImage:', error);
			throw new Error(error.response?.data?.message || 'Failed to scan image');
		}
	}

	async function getScanId() {
		setLoading(true);
		const { data } = await scanImage();

		if (data.id) {
			setLoading(false);
			setImage(null);
			router.navigate(`/expense-ocr/${data.id}`);
		}
	}

	return (
		<View className="justicy-center items-center px-6 gap-4">
			<TouchableOpacity
				onPress={pickImage}
				className="bg-red-50 border border-red-300 shadow-inner relative border-dashed rounded-xl w-full justify-center items-center gap-8 p-4"
			>
				<AddPhotoAlternateIcon />
				<Text className="text-[#9C041E] tracking-tight">
					Scan image from your storage
				</Text>

				<Text className="text-[#9C041E] tracking-tight absolute top-2 left-2 text-sm opacity-40 border border-red-600 px-2 rounded-md">
					Beta version
				</Text>
			</TouchableOpacity>

			{image && (
				<View className="gap-4">
					<Image
						source={{ uri: image }}
						style={{
							width: Dimensions.get('screen').width - 48,
							height: Dimensions.get('screen').width - 48,
							borderRadius: 12,
						}}
						className="shadow-md"
					/>

					<View className="flex-row gap-2 w-full justify-end">
						<TouchableOpacity
							disabled={loading}
							onPress={() => setImage(null)}
							className="flex-row border py-2 px-4 rounded-lg items-center justify-center gap-2 bg-slate-100 border-slate-300"
						>
							<Text>Cancel Selection</Text>
						</TouchableOpacity>

						<TouchableOpacity
							disabled={loading}
							onPress={() => getScanId()}
							className="flex-row border py-2 px-4 rounded-lg items-center justify-center gap-2 bg-[#FF4863] border-[#FF6A83]"
						>
							<TextCompareIcon />
							<Text className="text-lg tracking-tight text-white">
								{loading ? 'Scanning...' : 'Scan now'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);
}
