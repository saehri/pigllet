import { LucideIcon } from 'lucide-react-native';

declare interface TransactionIconsCatalogue {
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
	salary: LucideIcon;
	freelance: LucideIcon;
	'business-income': LucideIcon;
	'bonuses-and-commission': LucideIcon;
	'overtime-pay': LucideIcon;
	dividens: LucideIcon;
	'interest-income': LucideIcon;
	'capital-gains': LucideIcon;
	'rental-income': LucideIcon;
	royalties: LucideIcon;
	'affiliate-marketing': LucideIcon;
	advertising: LucideIcon;
	dropshipping: LucideIcon;
	pension: LucideIcon;
	'unemployment-benefits': LucideIcon;
	'child-support': LucideIcon;
	alimony: LucideIcon;
	'gifts-and-donations': LucideIcon;
	'lottery-and-gambling': LucideIcon;
	'side-hustles': LucideIcon;
	'bank-transfer': LucideIcon;
	'cash-deposit': LucideIcon;
	'cash-withdrawal': LucideIcon;
	'credit-card-payment': LucideIcon;
	'savings-contribution': LucideIcon;
	'received-from-family': LucideIcon;
	'sent-to-family': LucideIcon;
	'loan-received': LucideIcon;
	'loan-payment': LucideIcon;
	'foods-and-drinks': LucideIcon;
}

declare interface UserPreference {
	currentAppTheme: AppTheme;
	currentAppColor: AppColor;
	currentCurrencySymbol: CurrencySymbols;
	firstTimer: boolean;
}

// from left to right: usd, idr, yen, gbp,
declare type CurrencySymbols = '$' | 'Rp' | '¥' | '£';

declare type AppTheme = 'Light' | 'Dark' | 'Device';

declare type AppColor =
	| 'Default'
	| 'Emerald'
	| 'Onyx'
	| 'Citrine'
	| 'Rose Quartz';
