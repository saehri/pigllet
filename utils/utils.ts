export function getYearsBetween(startYear: number, endYear: number) {
	return Array.from(
		{ length: endYear - startYear + 1 },
		(_, i) => startYear + i
	);
}
