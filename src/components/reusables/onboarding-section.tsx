import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type Props = {
	title: string;
	description: string;
};

export default function OnboardingSection({ title, description }: Props) {
	const theme = useTheme();

	return (
		<Animated.View
			style={styles.section}
			entering={FadeIn.duration(500)}
			exiting={FadeOut.duration(500)}
		>
			<LinearGradient
				colors={[theme.colors.background, 'transparent']}
				start={{ x: 0.5, y: 1 }}
				end={{ x: 0.5, y: 0 }}
				style={styles.imageContainer}
			>
				<Image
					source={require('@/assets/images/welcome image.png')}
					style={styles.image}
				/>
			</LinearGradient>

			<View style={styles.textContainer}>
				<Text variant="headlineMedium" style={styles.title}>
					{title}
				</Text>
				<Text variant="bodyMedium" style={styles.desc}>
					{description}
				</Text>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	section: {
		flex: 1,
	},
	imageContainer: {
		flex: 1,
	},
	image: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		zIndex: -1,
		objectFit: 'contain',
	},
	title: {
		marginBottom: 10,
		fontFamily: 'Manrope-ExtraBold',
		textAlign: 'center',
	},
	desc: {
		textAlign: 'center',
		fontFamily: 'Manrope-Regular',
		opacity: 0.7,
		maxWidth: '70%',
		alignSelf: 'center',
	},
	textContainer: {
		padding: 20,
		paddingBottom: 36,
	},
});

