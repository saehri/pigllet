import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';

export default function SecondarySetting() {
	return (
		<List.Section>
			<List.Subheader>Billing and support</List.Subheader>

			<List.Item
				title="Premium"
				description="Get the premium version of the app in Play Store"
				left={(props) => (
					<List.Icon
						{...props}
						style={{ ...props.style, alignSelf: 'center' }}
						icon="star-outline"
					/>
				)}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>

			<List.Item
				title="Write a review"
				description="if you are enjoying Pigllet please leave a review on the Play Store"
				left={(props) => (
					<List.Icon
						{...props}
						style={{ ...props.style, alignSelf: 'center' }}
						icon="heart-outline"
					/>
				)}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>

			<List.Item
				title="Contact us"
				description="If you need help or have some advice"
				left={(props) => <List.Icon {...props} icon="email-outline" />}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>

			<List.Item
				title="Become a tester"
				description="Access to early builds to get new feature faster"
				left={(props) => (
					<List.Icon
						{...props}
						style={{ ...props.style, alignSelf: 'center' }}
						icon="test-tube"
					/>
				)}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>

			<List.Item
				title="About"
				left={(props) => <List.Icon {...props} icon="information-outline" />}
				titleStyle={style.listTitle}
				style={style.listItemStyle}
			/>
		</List.Section>
	);
}

const style = StyleSheet.create({
	listTitle: {
		fontSize: 20,
	},
	listItemStyle: {
		paddingVertical: 10,
	},
});
