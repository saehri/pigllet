export default function getLocaleByCurrencySymbol(code: CurrencySymbols) {
	if (code === 'Rp') return 'id-ID';
	if (code === '$') return 'en-US';
	if (code === '¥') return 'ja-JP';
	if (code === '£') return 'en-GB';
}
