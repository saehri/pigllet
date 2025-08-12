export const currencySymbols = [
	{
		code: 'IDR',
		label: 'Indonesian Rupiah (IDR)',
		symbol: 'Rp',
		locale: 'id-ID',
	}, // Prioritized
	{ code: 'USD', label: 'US Dollar (USD)', symbol: '$', locale: 'en-US' },
	{ code: 'JPY', label: 'Japanese Yen (JPY)', symbol: '¥', locale: 'ja-JP' },
	{ code: 'GBP', label: 'British Pound (GBP)', symbol: '£', locale: 'en-GB' },
	{ code: 'EUR', label: 'Euro (EUR)', symbol: '€', locale: 'de-DE' },
	{
		code: 'KRW',
		label: 'South Korean Won (KRW)',
		symbol: '₩',
		locale: 'ko-KR',
	},
	{ code: 'INR', label: 'Indian Rupee (INR)', symbol: '₹', locale: 'en-IN' },
	{ code: 'PHP', label: 'Philippine Peso (PHP)', symbol: '₱', locale: 'en-PH' },
	{ code: 'NGN', label: 'Nigerian Naira (NGN)', symbol: '₦', locale: 'en-NG' },
	{
		code: 'UAH',
		label: 'Ukrainian Hryvnia (UAH)',
		symbol: '₴',
		locale: 'uk-UA',
	},
	{ code: 'BTC', label: 'Bitcoin (BTC)', symbol: '₿', locale: 'en-US' },
	{ code: 'RUB', label: 'Russian Ruble (RUB)', symbol: '₽', locale: 'ru-RU' },
	{ code: 'BRL', label: 'Brazilian Real (BRL)', symbol: 'R$', locale: 'pt-BR' },
	{ code: 'CHF', label: 'Swiss Franc (CHF)', symbol: 'CHF', locale: 'de-CH' },
	{ code: 'THB', label: 'Thai Baht (THB)', symbol: '฿', locale: 'th-TH' },
	{
		code: 'AED',
		label: 'United Arab Emirates Dirham (AED)',
		symbol: 'د.إ',
		locale: 'ar-AE',
	},
	{ code: 'SAR', label: 'Saudi Riyal (SAR)', symbol: '﷼', locale: 'ar-SA' },
	{
		code: 'CRC',
		label: 'Costa Rican Colón (CRC)',
		symbol: '₡',
		locale: 'es-CR',
	},
	{ code: 'CZK', label: 'Czech Koruna (CZK)', symbol: 'Kč', locale: 'cs-CZ' },
	{
		code: 'HUF',
		label: 'Hungarian Forint (HUF)',
		symbol: 'Ft',
		locale: 'hu-HU',
	},
	{
		code: 'ILS',
		label: 'Israeli New Shekel (ILS)',
		symbol: '₪',
		locale: 'he-IL',
	},
	{
		code: 'MKD',
		label: 'Macedonian Denar (MKD)',
		symbol: 'ден',
		locale: 'mk-MK',
	},
	{
		code: 'MYR',
		label: 'Malaysian Ringgit (MYR)',
		symbol: 'RM',
		locale: 'ms-MY',
	},
	{ code: 'PKR', label: 'Pakistani Rupee (PKR)', symbol: '₨', locale: 'ur-PK' },
	{
		code: 'KZT',
		label: 'Kazakhstani Tenge (KZT)',
		symbol: '₸',
		locale: 'kk-KZ',
	},
	{ code: 'BGN', label: 'Bulgarian Lev (BGN)', symbol: 'лв', locale: 'bg-BG' },
	{ code: 'PLN', label: 'Polish Złoty (PLN)', symbol: 'zł', locale: 'pl-PL' },
	{
		code: 'ANG',
		label: 'Netherlands Antillean Guilder (ANG)',
		symbol: 'ƒ',
		locale: 'nl-AN',
	},
	{ code: 'SEK', label: 'Krona', symbol: 'kr', locale: 'sv-SE' },
] as const;

export type CurrencySymbols = (typeof currencySymbols)[number]['symbol'];
export type CurrencyCode = (typeof currencySymbols)[number]['code'];

