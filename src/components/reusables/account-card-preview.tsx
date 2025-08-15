import { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type CardDesignPreview = {
	accountName: string;
	accountHolder: string;
	accountNumber: string;
	cardColor: string;
};

function AccountCardPreview({
	accountName,
	accountHolder,
	accountNumber,
	cardColor,
}: CardDesignPreview) {
	const cardNumber = accountNumber.length ? accountNumber : '****************';

	return (
		<View>
			<View style={styles.greenCard}></View>

			<View style={styles.redCard}></View>

			<View
				style={[
					styles.cardWrapper,
					{
						backgroundColor: cardColor,
					},
				]}
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
						{cardNumber.match(/.{1,4}/g)?.map((t, index) => (
							<Text
								key={index}
								variant="headlineSmall"
								style={{
									fontFamily: 'Manrope-Light',
									color: 'white',
								}}
							>
								{t}
							</Text>
						))}
					</View>

					<Text variant="bodyLarge" style={styles.accountName}>
						{accountName}
					</Text>

					<Text variant="bodyLarge" style={styles.accountHolder}>
						{accountHolder}
					</Text>
				</View>
			</View>
		</View>
	);
}

export default memo(AccountCardPreview);

const styles = StyleSheet.create({
	cardWrapper: {
		width: '100%',
		borderRadius: 24,
		marginVertical: 24,
		marginTop: 36,
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
		top: 120,
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
});

