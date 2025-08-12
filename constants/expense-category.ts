import { icons } from 'lucide-react-native';

export const expenseCategories: {
	label: string;
	icon: keyof typeof icons;
}[] = [
	{ label: 'Other Expense', icon: 'CircleArrowOutUpRight' },
	{ label: 'Grocery', icon: 'ShoppingBasket' },
	{ label: 'Restaurant', icon: 'HandPlatter' },
	{ label: 'Takeout', icon: 'Sandwich' },
	{ label: 'Transportation', icon: 'TrainFront' },
	{ label: 'Fuel & Gas', icon: 'Fuel' },
	{ label: 'Internet', icon: 'Router' },
	{ label: 'Utilities', icon: 'Wrench' },
	{ label: 'Medical', icon: 'Hospital' },
	{ label: 'Insurance', icon: 'ShieldPlus' },
	{ label: 'Clothing', icon: 'Shirt' },
	{ label: 'Taxes', icon: 'Coins' },
] as const;

