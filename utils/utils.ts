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
	income: 'rgba(21, 179, 15, 1)',
	expense: 'rgba(248, 110, 30, 1)',
	transfer: 'rgba(0, 150, 150, 1)',
};

