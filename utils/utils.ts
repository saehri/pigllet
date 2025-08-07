export const TRANSACTION_CARD_BR = {
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
export const transactionColorMap: Record<string, string> = {
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

