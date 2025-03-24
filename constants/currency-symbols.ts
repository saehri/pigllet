import { CurrencySymbols } from '@/types/type';

export const currencySymbols: {
	code: string;
	symbol: CurrencySymbols;
	label: string;
}[] = [
	{ code: 'IDR', label: 'Indonesian Rupiah (IDR)', symbol: 'Rp' }, // Prioritized
	{ code: 'USD', label: 'US Dollar (USD)', symbol: '$' },
	{ code: 'JPY', label: 'Japanese Yen (JPY)', symbol: '¥' },
	{ code: 'GBP', label: 'British Pound (GBP)', symbol: '£' },
	{ code: 'EUR', label: 'Euro (EUR)', symbol: '€' },
	{ code: 'KRW', label: 'South Korean Won (KRW)', symbol: '₩' },
	{ code: 'INR', label: 'Indian Rupee (INR)', symbol: '₹' },
	{ code: 'PHP', label: 'Philippine Peso (PHP)', symbol: '₱' },
	{ code: 'NGN', label: 'Nigerian Naira (NGN)', symbol: '₦' },
	{ code: 'UAH', label: 'Ukrainian Hryvnia (UAH)', symbol: '₴' },
	{ code: 'BTC', label: 'Bitcoin (BTC)', symbol: '₿' },
	{ code: 'RUB', label: 'Russian Ruble (RUB)', symbol: '₽' },
	{ code: 'BRL', label: 'Brazilian Real (BRL)', symbol: 'R$' },
	{ code: 'CHF', label: 'Swiss Franc (CHF)', symbol: 'CHF' },
	{ code: 'THB', label: 'Thai Baht (THB)', symbol: '฿' },
	{ code: 'AED', label: 'United Arab Emirates Dirham (AED)', symbol: 'د.إ' },
	{ code: 'SAR', label: 'Saudi Riyal (SAR)', symbol: '﷼' },
	{ code: 'CRC', label: 'Costa Rican Colón (CRC)', symbol: '₡' },
	{ code: 'CZK', label: 'Czech Koruna (CZK)', symbol: 'Kč' },
	{ code: 'HUF', label: 'Hungarian Forint (HUF)', symbol: 'Ft' },
	{ code: 'ILS', label: 'Israeli New Shekel (ILS)', symbol: '₪' },
	{ code: 'MKD', label: 'Macedonian Denar (MKD)', symbol: 'ден' },
	{ code: 'MYR', label: 'Malaysian Ringgit (MYR)', symbol: 'RM' },
	{ code: 'PKR', label: 'Pakistani Rupee (PKR)', symbol: '₨' },
	{ code: 'KZT', label: 'Kazakhstani Tenge (KZT)', symbol: '₸' },
	{ code: 'BGN', label: 'Bulgarian Lev (BGN)', symbol: 'лв' },
	{ code: 'PLN', label: 'Polish Złoty (PLN)', symbol: 'zł' },
	{ code: 'ANG', label: 'Netherlands Antillean Guilder (ANG)', symbol: 'ƒ' },
	{ code: 'SEK', label: 'Krona', symbol: 'kr' },
];
