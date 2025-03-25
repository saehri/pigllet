import { Text, useTheme } from 'react-native-paper';
import { ScrollView, View } from 'react-native';

import { Workflow } from 'lucide-react-native';

export default function NewIncome() {
	const theme = useTheme();

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					padding: 16,
					paddingTop: 59,
				}}
			>
				<Workflow
					size={120}
					strokeWidth={0.5}
					fillOpacity={0.3}
					fill={theme.colors.primary}
					color={theme.colors.onBackground}
				/>
				<Text
					style={{
						fontFamily: 'Inter-Regular',
						textAlign: 'center',
						maxWidth: 280,
					}}
					variant="bodyLarge"
				>
					This feature is in progress, and we’re working hard to deliver it
					soon.
				</Text>
			</View>
		</ScrollView>
	);
}
