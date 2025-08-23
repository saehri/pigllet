import { CurrencyCode, currencySymbols } from '@/constants/currency-symbols';
import { Easing } from 'react-native-reanimated';

export const cardBorderRadius: Record<
	CardPositionsTypes,
	{ tl: number; tr: number; bl: number; br: number }
> = {
	first: {
		tl: 16,
		tr: 16,
		bl: 6,
		br: 6,
	},
	middle: {
		tl: 6,
		tr: 6,
		bl: 6,
		br: 6,
	},
	last: {
		tl: 6,
		tr: 6,
		bl: 16,
		br: 16,
	},
	only: {
		tl: 16,
		tr: 16,
		bl: 16,
		br: 16,
	},
};

// Simple color mapping per category type
export const transactionColorMap: Record<
	'income' | 'expense' | 'transfer',
	string
> = {
	income: 'rgba(51, 206, 46, 1)',
	expense: 'rgba(248, 81, 30, 1)',
	transfer: 'rgba(96, 118, 216, 1)',
};

export function getCardPosition(
	index: number,
	length: number
): 'only' | 'first' | 'middle' | 'last' {
	if (length === 1) return 'only';
	if (index === 0) return 'first';
	if (index === length - 1) return 'last';
	return 'middle';
}

export function formatCurrencyByCode(value: number, code: CurrencyCode) {
	const match = currencySymbols.find((c) => c.code === code);

	return value.toLocaleString(match?.locale || 'id-ID', {
		style: 'currency',
		currency: match?.code || 'IDR',
		currencySign: 'accounting',
		maximumFractionDigits: 0,
	});
}

export const fastSpatialEasing: any = Easing.bezier(0.42, 1.67, 0.21, 0.9);

