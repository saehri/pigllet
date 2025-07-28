export function getYearsBetween(startYear: number, endYear: number) {
	return Array.from(
		{ length: endYear - startYear + 1 },
		(_, i) => startYear + i
	);
}

export function toYYYYMMDD(date: Date): string {
	return date.toISOString().slice(0, 10); // Returns 'YYYY-MM-DD' in UTC
}

// Simple color mapping per category type
export const transactionColorMap: Record<string, string> = {
	income: 'rgba(51, 206, 46, 1)',
	expense: 'rgba(248, 81, 30, 1)',
	transfer: 'rgba(96, 118, 216, 1)',
};

