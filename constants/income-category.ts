import { icons } from 'lucide-react-native';

export const incomeCategories: {
	label: string;
	icon: keyof typeof icons;
}[] = [
	{ icon: 'CircleArrowOutDownLeft', label: 'Other Income' },
	{ icon: 'CircleDollarSign', label: 'Salary' },
	{ icon: 'Laptop', label: 'Freelance' },
	{ icon: 'BriefcaseBusiness', label: 'Bonuses & Commissions' },
	{ icon: 'Clock10', label: 'Overtime Pay' },
	{ icon: 'BriefcaseBusiness', label: 'Side Hustles' },
	{ icon: 'Gift', label: 'Gifts & Donations' },
	{ icon: 'Dices', label: 'Lottery & Gambling' },
];

