export function getYearsBetween(startYear: number, endYear: number) {
	return Array.from(
		{ length: endYear - startYear + 1 },
		(_, i) => startYear + i
	);
}

export function toYYYYMMDD(date: Date): string {
	return date.toISOString().slice(0, 10); // Returns 'YYYY-MM-DD' in UTC
}
