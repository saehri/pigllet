import { TransactionIconsCatalogue } from '@/types/type';

export const incomeCategories: {
	label: string;
	icon: keyof TransactionIconsCatalogue;
}[] = [
	{ icon: 'other', label: 'Other Income' },
	{ icon: 'salary', label: 'Salary' },
	{ icon: 'freelance', label: 'Freelance' },
	{ icon: 'bonuses-and-commission', label: 'Bonuses & Commissions' },
	{ icon: 'overtime-pay', label: 'Overtime Pay' },
	{ icon: 'side-hustles', label: 'Side Hustles' },
	{ icon: 'gifts-and-donations', label: 'Gifts & Donations' },
	{ icon: 'lottery-and-gambling', label: 'Lottery & Gambling' },
	{ icon: 'pension', label: 'Pension' },
	{ icon: 'unemployment-benefits', label: 'Unemployment Benefits' },
	{ icon: 'child-support', label: 'Child Support' },
	{ icon: 'alimony', label: 'Alimony' },
	{ icon: 'other', label: 'Other Income' },
];

