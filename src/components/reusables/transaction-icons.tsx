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
};

export default function TransactionIcons({ icon }: Props) {
	const theme = useTheme();

	const icons: Record<keyof TransactionIconsCatalogue, JSX.Element> = {
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
		salary: (
			<CircleDollarSign
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		royalties: (
			<Megaphone
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'affiliate-marketing': (
			<Store size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'bank-transfer': (
			<Landmark size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'bonuses-and-commission': (
			<HandCoins
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'business-income': (
			<BriefcaseBusiness
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'capital-gains': (
			<ChartCandlestick
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'cash-deposit': (
			<Vault size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'cash-withdrawal': (
			<ArrowDownLeft
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'child-support': (
			<Baby size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'credit-card-payment': (
			<CreditCard
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'gifts-and-donations': (
			<Gift size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'interest-income': (
			<Blend size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'loan-payment': (
			<HandHelping
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'loan-received': (
			<HandHelping
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'lottery-and-gambling': (
			<Dices size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'overtime-pay': (
			<Clock10 size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		'received-from-family': (
			<BookUser size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		pension: (
			<PiggyBank
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		dropshipping: (
			<Store size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		freelance: (
			<Laptop size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
		dividens: (
			<Waypoints
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		alimony: (
			<PersonStanding
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'rental-income': (
			<CircleDot
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'savings-contribution': (
			<CircleDot
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'sent-to-family': (
			<CircleDot
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'side-hustles': (
			<CircleDot
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'unemployment-benefits': (
			<CircleDot
				size={20}
				strokeWidth={1.5}
				color={theme.colors.onBackground}
			/>
		),
		'foods-and-drinks': (
			<Salad size={20} strokeWidth={1.5} color={theme.colors.onBackground} />
		),
	};

	return icons[icon];
}
