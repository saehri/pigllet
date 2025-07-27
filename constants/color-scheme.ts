import { AppColor, AppTheme } from '@/types/type';
import { ColorSchemeName } from 'react-native';

const DEFAULT_LIGHT = {
	colors: {
		primary: 'rgb(167, 57, 24)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(255, 219, 209)',
		onPrimaryContainer: 'rgb(59, 9, 0)',
		secondary: 'rgb(117, 91, 0)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(255, 224, 142)',
		onSecondaryContainer: 'rgb(36, 26, 0)',
		tertiary: 'rgb(0, 106, 106)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(111, 247, 246)',
		onTertiaryContainer: 'rgb(0, 32, 32)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(255, 251, 255)',
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
		primary: 'rgba(247, 133, 101, 1)',
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
		backdrop: 'rgba(59, 45, 41, 0.4)',
	},
};

const EMERALD_DARK = {
	colors: {
		primary: 'rgb(156, 215, 105)',
		onPrimary: 'rgb(26, 55, 0)',
		primaryContainer: 'rgb(40, 80, 0)',
		onPrimaryContainer: 'rgb(183, 244, 129)',
		secondary: 'rgb(130, 219, 126)',
		onSecondary: 'rgb(0, 57, 10)',
		secondaryContainer: 'rgb(0, 83, 18)',
		onSecondaryContainer: 'rgb(157, 248, 152)',
		tertiary: 'rgb(85, 219, 198)',
		onTertiary: 'rgb(0, 55, 48)',
		tertiaryContainer: 'rgb(0, 80, 71)',
		onTertiaryContainer: 'rgb(118, 248, 226)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(14, 14, 14)',
		onBackground: 'rgb(227, 227, 220)',
		surface: 'rgb(26, 28, 24)',
		onSurface: 'rgb(227, 227, 220)',
		surfaceVariant: 'rgb(68, 72, 62)',
		onSurfaceVariant: 'rgb(196, 200, 186)',
		outline: 'rgb(142, 146, 134)',
		outlineVariant: 'rgb(68, 72, 62)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(227, 227, 220)',
		inverseOnSurface: 'rgb(47, 49, 44)',
		inversePrimary: 'rgb(56, 107, 1)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(33, 37, 28)',
			level2: 'rgb(36, 43, 31)',
			level3: 'rgb(40, 49, 33)',
			level4: 'rgb(42, 50, 34)',
			level5: 'rgb(44, 54, 35)',
		},
		surfaceDisabled: 'rgba(227, 227, 220, 0.12)',
		onSurfaceDisabled: 'rgba(227, 227, 220, 0.38)',
		backdrop: 'rgba(0, 0, 0, 0.5)',
	},
};

const EMERALD_LIGHT = {
	colors: {
		primary: 'rgb(56, 107, 1)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(183, 244, 129)',
		onPrimaryContainer: 'rgb(13, 32, 0)',
		secondary: 'rgb(16, 109, 32)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(157, 248, 152)',
		onSecondaryContainer: 'rgb(0, 34, 4)',
		tertiary: 'rgb(0, 107, 94)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(118, 248, 226)',
		onTertiaryContainer: 'rgb(0, 32, 27)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(253, 253, 245)',
		onBackground: 'rgb(26, 28, 24)',
		surface: 'rgb(253, 253, 245)',
		onSurface: 'rgb(26, 28, 24)',
		surfaceVariant: 'rgb(224, 228, 214)',
		onSurfaceVariant: 'rgb(68, 72, 62)',
		outline: 'rgb(116, 121, 109)',
		outlineVariant: 'rgb(196, 200, 186)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(47, 49, 44)',
		inverseOnSurface: 'rgb(241, 241, 234)',
		inversePrimary: 'rgb(156, 215, 105)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(243, 246, 233)',
			level2: 'rgb(237, 241, 226)',
			level3: 'rgb(231, 237, 218)',
			level4: 'rgb(229, 236, 216)',
			level5: 'rgb(225, 233, 211)',
		},
		surfaceDisabled: 'rgba(26, 28, 24, 0.12)',
		onSurfaceDisabled: 'rgba(26, 28, 24, 0.38)',
		backdrop: 'rgba(0, 0, 0, 0.5)',
	},
};

const ONYX_DARK = {
	colors: {
		primary: 'rgb(255, 255, 255)',
		onPrimary: 'rgb(0, 0, 0)',
		primaryContainer: 'rgb(20, 20, 20)',
		onPrimaryContainer: 'rgb(200, 200, 200)',
		secondary: 'rgb(30, 30, 30)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(50, 50, 50)',
		onSecondaryContainer: 'rgb(180, 180, 180)',
		tertiary: 'rgb(50, 50, 50)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(70, 70, 70)',
		onTertiaryContainer: 'rgb(160, 160, 160)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(100, 0, 0)',
		onErrorContainer: 'rgb(255, 200, 200)',
		background: 'rgb(0, 0, 0)',
		onBackground: 'rgb(255, 255, 255)',
		surface: 'rgb(10, 10, 10)',
		onSurface: 'rgb(240, 240, 240)',
		surfaceVariant: 'rgb(37, 37, 37)',
		onSurfaceVariant: 'rgb(200, 200, 200)',
		outline: 'rgb(100, 100, 100)',
		outlineVariant: 'rgb(60, 60, 60)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(255, 255, 255)',
		inverseOnSurface: 'rgb(0, 0, 0)',
		inversePrimary: 'rgb(80, 80, 80)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(20, 20, 20)',
			level2: 'rgb(30, 30, 30)',
			level3: 'rgb(40, 40, 40)',
			level4: 'rgb(50, 50, 50)',
			level5: 'rgb(60, 60, 60)',
		},
		surfaceDisabled: 'rgba(255, 255, 255, 0.12)',
		onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',
		backdrop: 'rgba(0, 0, 0, 0.5)',
	},
};

const ONYX_LIGHT = {
	colors: {
		primary: 'rgb(44, 44, 44)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(230, 230, 230)',
		onPrimaryContainer: 'rgb(30, 30, 30)',
		secondary: 'rgb(240, 240, 240)',
		onSecondary: 'rgb(0, 0, 0)',
		secondaryContainer: 'rgb(220, 220, 220)',
		onSecondaryContainer: 'rgb(40, 40, 40)',
		tertiary: 'rgb(220, 220, 220)',
		onTertiary: 'rgb(0, 0, 0)',
		tertiaryContainer: 'rgb(200, 200, 200)',
		onTertiaryContainer: 'rgb(50, 50, 50)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(255, 255, 255)',
		onBackground: 'rgb(0, 0, 0)',
		surface: 'rgb(245, 245, 245)',
		onSurface: 'rgb(20, 20, 20)',
		surfaceVariant: 'rgb(230, 230, 230)',
		onSurfaceVariant: 'rgb(60, 60, 60)',
		outline: 'rgb(180, 180, 180)',
		outlineVariant: 'rgb(140, 140, 140)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(30, 30, 30)',
		inverseOnSurface: 'rgb(255, 255, 255)',
		inversePrimary: 'rgb(200, 200, 200)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(240, 240, 240)',
			level2: 'rgb(230, 230, 230)',
			level3: 'rgb(220, 220, 220)',
			level4: 'rgb(210, 210, 210)',
			level5: 'rgb(200, 200, 200)',
		},
		surfaceDisabled: 'rgba(0, 0, 0, 0.12)',
		onSurfaceDisabled: 'rgba(0, 0, 0, 0.38)',
		backdrop: 'rgba(255, 255, 255, 0.5)',
	},
};

const CITRINE_DARK = {
	colors: {
		primary: 'rgb(248, 189, 42)',
		onPrimary: 'rgb(64, 45, 0)',
		primaryContainer: 'rgb(92, 67, 0)',
		onPrimaryContainer: 'rgb(255, 223, 160)',
		secondary: 'rgb(255, 184, 101)',
		onSecondary: 'rgb(72, 42, 0)',
		secondaryContainer: 'rgb(102, 61, 0)',
		onSecondaryContainer: 'rgb(255, 221, 186)',
		tertiary: 'rgb(255, 183, 134)',
		onTertiary: 'rgb(80, 36, 0)',
		tertiaryContainer: 'rgb(114, 54, 0)',
		onTertiaryContainer: 'rgb(255, 220, 198)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(14, 14, 14)',
		onBackground: 'rgb(233, 225, 216)',
		surface: 'rgb(30, 27, 22)',
		onSurface: 'rgb(233, 225, 216)',
		surfaceVariant: 'rgb(77, 70, 57)',
		onSurfaceVariant: 'rgb(208, 197, 180)',
		outline: 'rgb(153, 143, 128)',
		outlineVariant: 'rgb(77, 70, 57)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(233, 225, 216)',
		inverseOnSurface: 'rgb(52, 48, 42)',
		inversePrimary: 'rgb(121, 89, 0)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(41, 35, 23)',
			level2: 'rgb(47, 40, 24)',
			level3: 'rgb(54, 45, 24)',
			level4: 'rgb(56, 46, 24)',
			level5: 'rgb(61, 50, 25)',
		},
		surfaceDisabled: 'rgba(233, 225, 216, 0.12)',
		onSurfaceDisabled: 'rgba(233, 225, 216, 0.38)',
		backdrop: 'rgba(0, 0, 0, 0.4)',
	},
};

const CITRINE_LIGHT = {
	colors: {
		primary: 'rgb(121, 89, 0)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(255, 223, 160)',
		onPrimaryContainer: 'rgb(38, 26, 0)',
		secondary: 'rgb(135, 82, 0)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(255, 221, 186)',
		onSecondaryContainer: 'rgb(43, 23, 0)',
		tertiary: 'rgb(150, 73, 0)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(255, 220, 198)',
		onTertiaryContainer: 'rgb(49, 19, 0)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(255, 251, 255)',
		onBackground: 'rgb(30, 27, 22)',
		surface: 'rgb(255, 251, 255)',
		onSurface: 'rgb(30, 27, 22)',
		surfaceVariant: 'rgb(237, 225, 207)',
		onSurfaceVariant: 'rgb(77, 70, 57)',
		outline: 'rgb(127, 118, 103)',
		outlineVariant: 'rgb(208, 197, 180)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(52, 48, 42)',
		inverseOnSurface: 'rgb(248, 239, 231)',
		inversePrimary: 'rgb(248, 189, 42)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(248, 243, 242)',
			level2: 'rgb(244, 238, 235)',
			level3: 'rgb(240, 233, 227)',
			level4: 'rgb(239, 232, 224)',
			level5: 'rgb(236, 228, 219)',
		},
		surfaceDisabled: 'rgba(30, 27, 22, 0.12)',
		onSurfaceDisabled: 'rgba(30, 27, 22, 0.38)',
		backdrop: 'rgba(0, 0, 0, 0.4)',
	},
};

const ROSE_QUARTZ_DARK = {
	colors: {
		primary: 'rgb(243, 178, 179)',
		onPrimary: 'rgb(95, 19, 28)',
		primaryContainer: 'rgb(126, 42, 48)',
		onPrimaryContainer: 'rgb(255, 218, 217)',
		secondary: 'rgb(255, 179, 180)',
		onSecondary: 'rgb(95, 19, 28)',
		secondaryContainer: 'rgb(126, 42, 48)',
		onSecondaryContainer: 'rgb(255, 218, 217)',
		tertiary: 'rgb(255, 179, 180)',
		onTertiary: 'rgb(95, 19, 28)',
		tertiaryContainer: 'rgb(126, 42, 48)',
		onTertiaryContainer: 'rgb(255, 218, 217)',
		error: 'rgb(255, 180, 171)',
		onError: 'rgb(105, 0, 5)',
		errorContainer: 'rgb(147, 0, 10)',
		onErrorContainer: 'rgb(255, 180, 171)',
		background: 'rgb(14, 14, 14)',
		onBackground: 'rgb(236, 224, 223)',
		surface: 'rgb(32, 26, 26)',
		onSurface: 'rgb(236, 224, 223)',
		surfaceVariant: 'rgb(82, 67, 67)',
		onSurfaceVariant: 'rgb(215, 193, 193)',
		outline: 'rgb(160, 140, 140)',
		outlineVariant: 'rgb(82, 67, 67)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(236, 224, 223)',
		inverseOnSurface: 'rgb(54, 47, 47)',
		inversePrimary: 'rgb(156, 65, 70)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(43, 34, 34)',
			level2: 'rgb(50, 38, 38)',
			level3: 'rgb(57, 43, 43)',
			level4: 'rgb(59, 44, 45)',
			level5: 'rgb(63, 47, 48)',
		},
		surfaceDisabled: 'rgba(236, 224, 223, 0.12)',
		onSurfaceDisabled: 'rgba(236, 224, 223, 0.38)',
		backdrop: 'rgba(0, 0, 0, 0.5)',
	},
};

const ROSE_QUARTZ_LIGHT = {
	colors: {
		primary: 'rgb(226, 128, 132)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(255, 218, 217)',
		onPrimaryContainer: 'rgb(64, 0, 10)',
		secondary: 'rgb(226, 113, 119)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(255, 218, 217)',
		onSecondaryContainer: 'rgb(64, 0, 10)',
		tertiary: 'rgb(173, 78, 83)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(255, 218, 217)',
		onTertiaryContainer: 'rgb(64, 0, 10)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(255, 251, 255)',
		onBackground: 'rgb(32, 26, 26)',
		surface: 'rgb(255, 251, 255)',
		onSurface: 'rgb(32, 26, 26)',
		surfaceVariant: 'rgb(244, 221, 221)',
		onSurfaceVariant: 'rgb(82, 67, 67)',
		outline: 'rgb(133, 115, 115)',
		outlineVariant: 'rgb(215, 193, 193)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(54, 47, 47)',
		inverseOnSurface: 'rgb(251, 238, 237)',
		inversePrimary: 'rgb(255, 179, 180)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(250, 242, 246)',
			level2: 'rgb(247, 236, 240)',
			level3: 'rgb(244, 231, 235)',
			level4: 'rgb(243, 229, 233)',
			level5: 'rgb(241, 225, 229)',
		},
		surfaceDisabled: 'rgba(32, 26, 26, 0.12)',
		onSurfaceDisabled: 'rgba(32, 26, 26, 0.38)',
		backdrop: 'rgba(0, 0, 0, 0.5)',
	},
};

function selectColorScheme(
	theme: AppTheme,
	color: AppColor,
	colorScheme: ColorSchemeName
) {
	if (theme === 'Dark') {
		if (color === 'Default') {
			return DEFAULT_DARK.colors;
		}
		if (color === 'Emerald') {
			return EMERALD_DARK.colors;
		}
		if (color === 'Onyx') {
			return ONYX_DARK.colors;
		}
		if (color === 'Citrine') {
			return CITRINE_DARK.colors;
		}
		if (color === 'Rose Quartz') {
			return ROSE_QUARTZ_DARK.colors;
		}
	}

	if (theme === 'Light') {
		if (color === 'Default') {
			return DEFAULT_LIGHT.colors;
		}
		if (color === 'Emerald') {
			return EMERALD_LIGHT.colors;
		}
		if (color === 'Onyx') {
			return ONYX_LIGHT.colors;
		}
		if (color === 'Citrine') {
			return CITRINE_LIGHT.colors;
		}
		if (color === 'Rose Quartz') {
			return ROSE_QUARTZ_LIGHT.colors;
		}
	}

	if (theme === 'Device') {
		if (colorScheme === 'dark') {
			if (color === 'Default') {
				return DEFAULT_DARK.colors;
			}
			if (color === 'Emerald') {
				return EMERALD_DARK.colors;
			}
			if (color === 'Onyx') {
				return ONYX_DARK.colors;
			}
			if (color === 'Citrine') {
				return CITRINE_DARK.colors;
			}
			if (color === 'Rose Quartz') {
				return ROSE_QUARTZ_DARK.colors;
			}
		}

		if (colorScheme === 'light') {
			if (color === 'Default') {
				return DEFAULT_LIGHT.colors;
			}
			if (color === 'Emerald') {
				return EMERALD_LIGHT.colors;
			}
			if (color === 'Onyx') {
				return ONYX_LIGHT.colors;
			}
			if (color === 'Citrine') {
				return CITRINE_LIGHT.colors;
			}
			if (color === 'Rose Quartz') {
				return ROSE_QUARTZ_LIGHT.colors;
			}
		}
	}

	return DEFAULT_LIGHT.colors;
}

export {
	selectColorScheme,
	DEFAULT_DARK,
	DEFAULT_LIGHT,
	EMERALD_DARK,
	EMERALD_LIGHT,
	ONYX_DARK,
	ONYX_LIGHT,
	CITRINE_DARK,
	CITRINE_LIGHT,
};

