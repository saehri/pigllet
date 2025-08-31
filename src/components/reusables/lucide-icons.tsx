import { icons } from 'lucide-react-native';

type Props = {
	name: keyof typeof icons;
	color?: string;
	size?: number;
};

const LucideIcons = ({ name, color, size }: Props) => {
	const LucideIcon = icons[name] ?? icons.CircleAlert;
	return <LucideIcon color={color} size={size} strokeWidth={1.5} />;
};

export default LucideIcons;

