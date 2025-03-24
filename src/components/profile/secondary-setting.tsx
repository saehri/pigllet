import { List } from 'react-native-paper';
import {
	BadgeInfo,
	FlaskRound,
	Heart,
	Mail,
	Star,
	User,
} from 'lucide-react-native';

export default function SecondarySetting() {
	return (
		<List.Section>
			<List.Subheader style={{ fontFamily: 'Inter-SemiBold' }}>
				Billing and support
			</List.Subheader>

			<List.Item
				title="Premium (coming soon)"
				description="Get the premium version of the app in Play Store"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<Star
						style={{ ...props.style, alignSelf: 'center' }}
						size={24}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			/>

			<List.Item
				title="Write a review"
				description="if you are enjoying Pigllet please leave a review on the Play Store"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<Heart
						{...props}
						style={{ ...props.style, alignSelf: 'center' }}
						size={24}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			/>

			<List.Item
				title="Contact us"
				description="If you need help or have some advice"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<Mail {...props} size={24} strokeWidth={1.5} color={props.color} />
				)}
			/>

			<List.Item
				title="Become a tester"
				description="Access to early builds to get new feature faster"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<FlaskRound
						{...props}
						style={{ ...props.style, alignSelf: 'center' }}
						size={24}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			/>

			<List.Item
				title="About"
				titleStyle={{ fontFamily: 'Inter-Regular' }}
				descriptionStyle={{ fontFamily: 'Inter-Light' }}
				left={(props) => (
					<BadgeInfo
						{...props}
						size={24}
						strokeWidth={1.5}
						color={props.color}
					/>
				)}
			/>
		</List.Section>
	);
}
