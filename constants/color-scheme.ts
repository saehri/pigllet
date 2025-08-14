const DEFAULT_LIGHT = {
	colors: {
		primary: 'hsla(14, 75%, 38%, 1.00)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(255, 219, 209)',
		onPrimaryContainer: 'rgb(59, 9, 0)',
		secondary: 'rgb(117, 91, 0)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(255, 224, 142)',
		onSecondaryContainer: 'rgb(36, 26, 0)',
		tertiary: 'rgb(0, 106, 106)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgba(100, 184, 184, 1)',
		onTertiaryContainer: 'rgb(0, 32, 32)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgba(255, 255, 255, 1)',
		onBackground: 'rgb(32, 26, 24)',
		surface: 'rgb(255, 251, 255)',
		onSurface: 'rgb(32, 26, 24)',
		surfaceVariant: 'rgb(245, 222, 216)',
		onSurfaceVariant: 'rgb(83, 67, 63)',
		outline: 'rgb(133, 115, 110)',
		outlineVariant: 'rgb(216, 194, 188)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(54, 47, 45)',
		inverseOnSurface: 'rgb(251, 238, 235)',
		inversePrimary: 'rgb(255, 181, 160)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(251, 241, 243)',
			level2: 'rgb(248, 236, 237)',
			level3: 'rgb(245, 230, 230)',
			level4: 'rgb(244, 228, 227)',
			level5: 'rgb(243, 224, 223)',
		},
		surfaceDisabled: 'rgba(32, 26, 24, 0.12)',
		onSurfaceDisabled: 'rgba(32, 26, 24, 0.38)',
		backdrop: 'rgba(59, 45, 42, 0.4)',
	},
};

const DEFAULT_DARK = {
	colors: {
		primary: 'hsla(13, 90%, 68%, 1.00)',
		onPrimary: 'rgb(96, 21, 0)',
		primaryContainer: 'rgb(135, 33, 0)',
		onPrimaryContainer: 'rgb(255, 219, 209)',
		secondary: 'rgb(236, 194, 70)',
		onSecondary: 'rgb(61, 46, 0)',
		secondaryContainer: 'rgb(88, 68, 0)',
		onSecondaryContainer: 'rgb(255, 224, 142)',
		tertiary: 'rgb(76, 218, 218)',
		onTertiary: 'rgb(0, 55, 55)',
		tertiaryContainer: 'rgb(0, 79, 80)',
		onTertiaryContainer: 'rgb(111, 247, 246)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(32, 26, 24)',
		onBackground: 'rgb(237, 224, 221)',
		surface: 'rgb(32, 26, 24)',
		onSurface: 'rgb(237, 224, 221)',
		surfaceVariant: 'rgb(83, 67, 63)',
		onSurfaceVariant: 'rgb(216, 194, 188)',
		outline: 'rgb(160, 140, 135)',
		outlineVariant: 'rgb(83, 67, 63)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(237, 224, 221)',
		inverseOnSurface: 'rgb(54, 47, 45)',
		inversePrimary: 'rgb(176, 46, 0)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(43, 34, 31)',
			level2: 'rgb(50, 38, 35)',
			level3: 'rgb(57, 43, 39)',
			level4: 'rgb(59, 45, 40)',
			level5: 'rgb(63, 48, 43)',
		},
		surfaceDisabled: 'rgba(237, 224, 221, 0.12)',
		onSurfaceDisabled: 'rgba(237, 224, 221, 0.38)',
		backdrop: 'rgba(19, 16, 15, 0.8)',
	},
};

function selectColorScheme(theme: AppTheme) {
	if (theme === 'Dark') {
		return DEFAULT_DARK.colors;
	}

	if (theme === 'Light') {
		return DEFAULT_LIGHT.colors;
	}

	return DEFAULT_DARK.colors;
}

export { selectColorScheme, DEFAULT_DARK, DEFAULT_LIGHT };

