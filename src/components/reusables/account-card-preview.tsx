import { memo, useState } from 'react';
import { Text } from 'react-native-paper';
import { EyeClosedIcon, EyeIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image, Pressable, StyleSheet, View } from 'react-native';

type CardDesignPreview = {
	accountName: string;
	accountHolder: string;
	accountNumber: string;
	cardColor: string;
	isDefault: boolean;
	animationKey: any;
};

function AccountCardPreview({
	accountName,
	accountHolder,
	accountNumber,
	cardColor,
	isDefault,
	animationKey,
}: CardDesignPreview) {
	const [showCardNumber, setShowCardNumber] = useState(false);

	const cardNumberRenderer = () => {
		if (showCardNumber && accountNumber.length)
			return (
				<>
					{accountNumber.match(/.{1,4}/g)?.map((t, index) => (
						<Text key={index} style={styles.cardNumber}>
							{t}
						</Text>
					))}
				</>
			);

		return <Text style={styles.cardNumber}>{`****   ****   ****   ****`}</Text>;
	};

	return (
		<Animated.View key={animationKey}>
			<Animated.View
				entering={FadeInDown.delay(300)
					.springify()
					.mass(1)
					.damping(10)
					.stiffness(100)}
				style={styles.greenCard}
			></Animated.View>

			<Animated.View
				entering={FadeInDown.delay(200)
					.springify()
					.mass(1)
					.damping(10)
					.stiffness(100)}
				style={styles.redCard}
			></Animated.View>

			<Animated.View
				style={[
					styles.cardWrapper,
					{
						backgroundColor: cardColor,
					},
				]}
				entering={FadeInDown.springify()
					.delay(100)
					.mass(1)
					.damping(10)
					.stiffness(100)}
			>
				<Image
					source={require('@/assets/images/cards/pig pattern.png')}
					style={styles.cardPattern}
				/>

				<View style={styles.cardContent}>
					<Image
						source={require('@/assets/images/cards/card chip.png')}
						style={styles.cardChip}
					/>

					<View style={styles.accountNumber}>
						{cardNumberRenderer()}

						<Pressable
							style={styles.numberVisibilityToggle}
							onPress={() => setShowCardNumber(!showCardNumber)}
						>
							{showCardNumber ? (
								<EyeIcon color={'white'} size={20} strokeWidth={1.5} />
							) : (
								<EyeClosedIcon color={'white'} size={20} strokeWidth={1.5} />
							)}
						</Pressable>
					</View>

					<View style={styles.accountName}>
						<Text
							variant="bodyMedium"
							style={{ fontFamily: 'Manrope-ExtraBold' }}
						>
							{accountName}
						</Text>

						<Text
							variant="labelSmall"
							style={[
								styles.isMainLabel,
								{
									display: isDefault ? 'flex' : 'none',
								},
							]}
						>
							Main
						</Text>
					</View>

					<Text variant="bodyMedium" style={styles.accountHolder}>
						{accountHolder}
					</Text>
				</View>
			</Animated.View>
		</Animated.View>
	);
}

export default memo(AccountCardPreview);

const styles = StyleSheet.create({
	cardWrapper: {
		width: '100%',
		borderRadius: 24,
		marginTop: 30,
		boxShadow: '0px 0px 10px 5px rgba(0,0,0,.2)',
	},
	cardContent: {
		width: '100%',
		paddingTop: `${(638 / 1011) * 100}%`,
		flexDirection: 'row',
		alignItems: 'center',
	},
	accountNumber: {
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 40,
		top: 110,
		gap: 15,
		justifyContent: 'center',
		position: 'absolute',
	},
	accountName: {
		fontFamily: 'Manrope-ExtraBold',
		position: 'absolute',
		top: 16,
		left: 16,
		color: 'white',
		flexDirection: 'row',
		gap: 8,
	},
	accountHolder: {
		fontFamily: 'Manrope-ExtraBold',
		position: 'absolute',
		bottom: 16,
		right: 16,
		color: 'white',
	},
	cardChip: {
		objectFit: 'cover',
		position: 'absolute',
		zIndex: 2,
		left: 40,
		top: 70,
		width: 45,
		height: 31.2,
	},
	cardPattern: {
		borderRadius: 24,
		objectFit: 'cover',
		width: '100%',
		height: '100%',
		opacity: 0.5,
		position: 'absolute',
		top: 0,
		left: 0,
	},
	cardNumber: {
		fontFamily: 'Manrope-Light',
		color: 'white',
		fontSize: 22,
	},
	redCard: {
		width: '90%',
		height: 100,
		position: 'absolute',
		backgroundColor: 'red',
		borderRadius: 24,
		top: 20,
		left: '5%',
		boxShadow: '0px 0px 10px 5px rgba(0,0,0,.2)',
	},
	greenCard: {
		width: '80%',
		height: 100,
		position: 'absolute',
		backgroundColor: 'green',
		borderRadius: 24,
		top: 10,
		left: '10%',
	},
	isMainLabel: {
		fontFamily: 'Manrope-Light',
		color: 'white',
		backgroundColor: 'rgba(255,255,255,.2)',
		padding: 1,
		paddingHorizontal: 4,
		fontSize: 9,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,.5)',
	},
	numberVisibilityToggle: {
		position: 'absolute',
		top: -30,
		right: 24,
		width: 40,
		height: 40,
		// backgroundColor: 'red',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

