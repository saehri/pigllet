import { View } from 'react-native';
import {
	Icon,
	Surface,
	SurfaceProps,
	Text,
	useTheme,
} from 'react-native-paper';

interface WidgetWrapper extends SurfaceProps {
	icon: string;
	title: string;
	customStyle?: any;
}

export default function WidgetWrapper(props: WidgetWrapper) {
	const theme = useTheme();

	return (
		<Surface
			mode="flat"
			elevation={2}
			style={{
				borderRadius: 16,
				padding: 16,
				...props.customStyle,
			}}
		>
			<View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
				<View
					style={{
						width: 26,
						height: 26,
						borderRadius: 100,
						backgroundColor: theme.colors.secondary,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Icon source={props.icon} size={20} color={theme.colors.background} />
				</View>

				<Text
					variant="bodyLarge"
					style={{ fontWeight: 'bold', color: theme.colors.primary }}
				>
					{props.title}
				</Text>
			</View>

			{props.children}
		</Surface>
	);
}
