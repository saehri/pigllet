import { TransactionIconsCatalogue } from '@/types/type';

export const expenseCategories: {
	label: string;
	icon: keyof TransactionIconsCatalogue;
}[] = [
	{ label: 'Other Expense', icon: 'other' },
	{ label: 'Grocery', icon: 'grocery' },
	{ label: 'Foods & Drinks', icon: 'foods-and-drinks' },
	{ label: 'Restaurant', icon: 'restaurant' },
	{ label: 'Takeout', icon: 'takeout' },
	{ label: 'Food Delivery', icon: 'food-delivery' },
	{ label: 'Transportation', icon: 'transportation' },
	{ label: 'Fuel & Gas', icon: 'fuel-and-gas' },
	{ label: 'Internet', icon: 'internet' },
	{ label: 'Utilities', icon: 'utilities' },
	{ label: 'Medical', icon: 'medical' },
	{ label: 'Insurance', icon: 'insurance' },
	{ label: 'Clothing', icon: 'clothing' },
	{ label: 'Taxes', icon: 'taxes' },
] as const;

