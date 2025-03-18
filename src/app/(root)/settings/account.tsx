import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import {
	UserPreferenceContext,
	UserPreferenceContextTypes,
} from '@/context/UserPreferenceContext';

import SettingContentButton from '@/src/components/settings/setting-content-button';
import SettingContentWrapper from '@/src/components/settings/setting-content-wrapper';
import { useRouter } from 'expo-router';

export default function AccountSettingScreen() {
	const theme = useTheme();

	return (
		<ScrollView
			style={{ backgroundColor: theme.colors.background, padding: 16 }}
		>
			<View style={{ gap: 24 }}>
				<SettingContentWrapper headerTitle="Account">
					<SettingContentButton
						label="Email (Coming soon)"
						buttonRight={
							<ChevronRight
								strokeWidth={1.5}
								size={20}
								color={theme.colors.onSurface}
								style={{ opacity: 0.6 }}
							/>
						}
					/>
					<SettingContentButton
						label="Password (Coming soon)"
						buttonRight={
							<ChevronRight
								strokeWidth={1.5}
								size={20}
								color={theme.colors.onSurface}
								style={{ opacity: 0.6 }}
							/>
						}
					/>
				</SettingContentWrapper>

				<ResetUserPreference />
			</View>
		</ScrollView>
	);
}

function ResetUserPreference() {
	const { resetUserPreferenceData } = useContext(
		UserPreferenceContext
	) as UserPreferenceContextTypes;
	const router = useRouter();
	const [visible, setVisible] = useState(false);

	const showDialog = () => setVisible(true);
	const hideDialog = () => setVisible(false);
	const handleReset = () => {
		// resetUserPreferenceData();
		hideDialog();
		router.push('/(auth)/welcome');
	};

	return (
		<>
			<SettingContentWrapper headerTitle="Danger area">
				<SettingContentButton
					label="Delete my data"
					labelStyle={{ color: '#ff0000' }}
					buttonRight={
						<ChevronRight strokeWidth={1.5} size={20} color={'#ff0000'} />
					}
					onPress={showDialog}
				/>
			</SettingContentWrapper>

			<Portal>
				<Dialog visible={visible} onDismiss={hideDialog}>
					<Dialog.Title style={{ fontFamily: 'Inter-Regular' }}>
						Alert
					</Dialog.Title>

					<Dialog.Content>
						<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
							This action cannot be undone.
						</Text>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={hideDialog}
							labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
						>
							Cancel
						</Button>

						<Button
							onPress={handleReset}
							labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
						>
							Ok
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
}
