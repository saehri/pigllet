import { useTheme } from 'react-native-paper';
import {
	ArrowDownLeft,
	Baby,
	Blend,
	Book,
	BookUser,
	BriefcaseBusiness,
	Car,
	CarFront,
	ChartCandlestick,
	CircleDollarSign,
	CircleDot,
	Clapperboard,
	Clock10,
	Coins,
	Computer,
	CreditCard,
	Dices,
	Drill,
	Fuel,
	Gift,
	GraduationCap,
	HandCoins,
	HandHelping,
	HandPlatter,
	Hospital,
	KeySquare,
	LampDesk,
	Landmark,
	Laptop,
	LaptopMinimalCheck,
	Martini,
	Megaphone,
	PersonStanding,
	PiggyBank,
	Plane,
	RailSymbol,
	Salad,
	ShieldPlus,
	Shirt,
	ShoppingBasket,
	ShoppingCart,
	SquareParking,
	Store,
	Utensils,
	Vault,
	Waypoints,
	Wifi,
} from 'lucide-react-native';
import { TransactionIconsCatalogue } from '@/types/type';

type Props = {
	icon: keyof TransactionIconsCatalogue;
	size?: number;
};

export default function TransactionIcons({ icon, size = 20 }: Props) {
	const theme = useTheme();

	const icons: Record<keyof TransactionIconsCatalogue, JSX.Element> = {
		other: (
			<CircleDot
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		advertising: (
			<Megaphone
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		airlines: (
			<Plane size={size} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'alcohol-and-bars': (
			<Martini
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'books-and-newspaper': (
			<Book
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'car-rental': (
			<Car
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		charity: (
			<HandCoins
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		clothing: (
			<Shirt
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		conferences: (
			<LaptopMinimalCheck
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		education: (
			<GraduationCap
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		entertainment: (
			<Clapperboard
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'facilities-expense': (
			<KeySquare
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'financial-institution-and-fees': (
			<Landmark
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'fuel-and-gas': (
			<Fuel
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'government-service': (
			<Landmark
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		grocery: (
			<ShoppingBasket
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'food-delivery': (
			<ShoppingCart
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		transportation: (
			<RailSymbol
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		insurance: (
			<ShieldPlus
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		medical: (
			<Hospital
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		internet: (
			<Wifi
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		parking: (
			<SquareParking
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'office-supplies': (
			<LampDesk
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		restaurant: (
			<Utensils
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		software: (
			<Computer
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		taxes: (
			<Coins
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		utilities: (
			<Drill
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'vehicle-expenses': (
			<CarFront
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		salary: (
			<CircleDollarSign
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		royalties: (
			<Megaphone
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'affiliate-marketing': (
			<Store
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'bank-transfer': (
			<Landmark
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'bonuses-and-commission': (
			<HandCoins
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'business-income': (
			<BriefcaseBusiness
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'capital-gains': (
			<ChartCandlestick
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'cash-deposit': (
			<Vault
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'cash-withdrawal': (
			<ArrowDownLeft
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'child-support': (
			<Baby
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'credit-card-payment': (
			<CreditCard
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'gifts-and-donations': (
			<Gift
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'interest-income': (
			<Blend
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'loan-payment': (
			<HandHelping
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'loan-received': (
			<HandHelping
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'lottery-and-gambling': (
			<Dices
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'overtime-pay': (
			<Clock10
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'received-from-family': (
			<BookUser
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		pension: (
			<PiggyBank
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		dropshipping: (
			<Store
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		freelance: (
			<Laptop
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		dividens: (
			<Waypoints
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		alimony: (
			<PersonStanding
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'rental-income': (
			<CircleDot
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'savings-contribution': (
			<CircleDot
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'sent-to-family': (
			<CircleDot
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'side-hustles': (
			<CircleDot
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'unemployment-benefits': (
			<CircleDot
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		'foods-and-drinks': (
			<Salad
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
		takeout: (
			<HandPlatter
				size={size}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
				fillOpacity={0.3}
				fill={theme.colors.onBackground}
			/>
		),
	};

	return icons[icon];
}

