import { icons } from 'lucide-react-native';

export const transferCategories: {
	label: string;
	icon: keyof typeof icons;
}[] = [
	{ icon: 'ArrowLeftRight', label: 'Other Transfer' },
	{ icon: 'Vault', label: 'Cash Deposit' },
	{ icon: 'ArrowDownLeft', label: 'Cash Withdrawal' },
	{ icon: 'CreditCard', label: 'Credit Card Payment' },
	{ icon: 'PiggyBank', label: 'Savings Contribution' },
];

