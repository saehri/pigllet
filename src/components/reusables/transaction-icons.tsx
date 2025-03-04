import { useTheme } from 'react-native-paper';
import {
	Book,
	Car,
	CarFront,
	CircleDot,
	Clapperboard,
	Coins,
	Computer,
	Drill,
	Fuel,
	GraduationCap,
	HandCoins,
	Hospital,
	KeySquare,
	LampDesk,
	Landmark,
	LaptopMinimalCheck,
	Martini,
	Megaphone,
	Plane,
	RailSymbol,
	ShieldPlus,
	Shirt,
	ShoppingBasket,
	ShoppingCart,
	SquareParking,
	Utensils,
	Wifi,
	type LucideIcon,
} from 'lucide-react-native';

type IconCatalog = {
	other: LucideIcon;
	advertising: LucideIcon;
	airlines: LucideIcon;
	'alcohol-and-bars': LucideIcon;
	'books-and-newspaper': LucideIcon;
	'car-rental': LucideIcon;
	charity: LucideIcon;
	clothing: LucideIcon;
	conferences: LucideIcon;
	education: LucideIcon;
	entertainment: LucideIcon;
	'facilities-expense': LucideIcon;
	'financial-institution-and-fees': LucideIcon;
	'fuel-and-gas': LucideIcon;
	'government-service': LucideIcon;
	grocery: LucideIcon;
	'food-delivery': LucideIcon;
	transportation: LucideIcon;
	insurance: LucideIcon;
	medical: LucideIcon;
	internet: LucideIcon;
	parking: LucideIcon;
	'office-supplies': LucideIcon;
	restaurant: LucideIcon;
	software: LucideIcon;
	taxes: LucideIcon;
	utilities: LucideIcon;
	'vehicle-expenses': LucideIcon;
};

type Props = {
	icon: keyof IconCatalog;
};

export default function TransactionIcons({ icon }: Props) {
	const theme = useTheme();

	const icons: Record<keyof IconCatalog, JSX.Element> = {
		other: (
			<CircleDot
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		advertising: (
			<Megaphone
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		airlines: (
			<Plane size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'alcohol-and-bars': (
			<Martini size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'books-and-newspaper': (
			<Book size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'car-rental': (
			<Car size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		charity: (
			<HandCoins
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		clothing: (
			<Shirt size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		conferences: (
			<LaptopMinimalCheck
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		education: (
			<GraduationCap
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		entertainment: (
			<Clapperboard
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'facilities-expense': (
			<KeySquare
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'financial-institution-and-fees': (
			<Landmark size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'fuel-and-gas': (
			<Fuel size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'government-service': (
			<Landmark size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		grocery: (
			<ShoppingBasket
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'food-delivery': (
			<ShoppingCart
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		transportation: (
			<RailSymbol
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		insurance: (
			<ShieldPlus
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		medical: (
			<Hospital size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		internet: (
			<Wifi size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		parking: (
			<SquareParking
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'office-supplies': (
			<LampDesk size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		restaurant: (
			<Utensils size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		software: (
			<Computer size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		taxes: (
			<Coins size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		utilities: (
			<Drill size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'vehicle-expenses': (
			<CarFront size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
	};

	return icons[icon];
}
