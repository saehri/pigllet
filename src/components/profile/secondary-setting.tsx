import { List } from 'react-native-paper';
import { BadgeInfo, FlaskRound, Heart, Mail, Star, User } from 'lucide-react-native'

export default function SecondarySetting() {
	return (
		<List.Section>
			<List.Subheader>Billing and support</List.Subheader>

			<List.Item
				title="Premium"
				description="Get the premium version of the app in Play Store"
				left={(props) => (
					<Star style={{ ...props.style, alignSelf: 'center' }} size={24} strokeWidth={1.5} color={props.color} />
				)}
			/>

			<List.Item
				title="Write a review"
				description="if you are enjoying Pigllet please leave a review on the Play Store"
				left={(props) => (
					<Heart
						{...props}
						style={{ ...props.style, alignSelf: 'center' }}
						size={24} strokeWidth={1.5} color={props.color}
					/>
				)}
			/>

			<List.Item
				title="Contact us"
				description="If you need help or have some advice"
				left={(props) => <Mail {...props} size={24} strokeWidth={1.5} color={props.color} />}
			/>

			<List.Item
				title="Become a tester"
				description="Access to early builds to get new feature faster"
				left={(props) => (
					<FlaskRound
						{...props}
						style={{ ...props.style, alignSelf: 'center' }}
						size={24} strokeWidth={1.5} color={props.color}
					/>
				)}
			/>

			<List.Item
				title="About"
				left={(props) => <BadgeInfo {...props} size={24} strokeWidth={1.5} color={props.color} />}
			/>
		</List.Section>
	);
}
