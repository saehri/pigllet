import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import CreateMainAccountForm from '@/src/components/forms/create-main-account-form';

export default function MainAccountSetupScreen() {
	const theme = useTheme();

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.background }]}
		>
			<View style={styles.imageContainer}>
				<Image
					source={require('@/assets/images/wallet.png')}
					style={{ width: 285, height: 280 }}
				/>
			</View>

			<View style={styles.contentContainer}>
				<Text variant="headlineLarge" style={styles.headlineLarge}>
					Let's set up your account
				</Text>

				<Text variant="bodyLarge" numberOfLines={2} style={styles.bodyLarge}>
					Enter you account balance
				</Text>

				<CreateMainAccountForm />

				<View>
					<Text variant="labelSmall" style={styles.labelSmall}>
						*This will be your main account
					</Text>
					<Text variant="labelSmall" style={styles.labelSmall}>
						**You can add more account by going to the setting.
					</Text>
					<Text variant="labelSmall" style={styles.labelSmall}>
						***Pigllet is a local first application meaning you can use it
						without internet connection.
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imageContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 24,
		paddingTop: 56,
	},
	contentContainer: {
		padding: 16,
		gap: 16,
	},
	labelSmall: {
		fontFamily: 'Inter-Regular',
		opacity: 0.6,
		textAlign: 'center',
		marginTop: 16,
	},
	headlineLarge: {
		fontFamily: 'Inter-Black',
		textAlign: 'center',
	},
	bodyLarge: {
		fontFamily: 'Inter-Regular',
		textAlign: 'center',
		opacity: 0.8,
	},
});

