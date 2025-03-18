declare interface ExpenseCategoryIconCatalog {
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
