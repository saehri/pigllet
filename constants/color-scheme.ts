const DEFAULT_LIGHT = {
  colors: {
    primary: "rgb(0, 104, 123)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(174, 236, 255)",
    onPrimaryContainer: "rgb(0, 31, 38)",
    secondary: "rgb(0, 104, 122)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(173, 236, 255)",
    onSecondaryContainer: "rgb(0, 31, 38)",
    tertiary: "rgb(74, 88, 169)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(222, 224, 255)",
    onTertiaryContainer: "rgb(0, 16, 92)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(251, 252, 254)",
    onBackground: "rgb(25, 28, 29)",
    surface: "rgb(251, 252, 254)",
    onSurface: "rgb(25, 28, 29)",
    surfaceVariant: "rgb(219, 228, 231)",
    onSurfaceVariant: "rgb(63, 72, 75)",
    outline: "rgb(112, 121, 124)",
    outlineVariant: "rgb(191, 200, 203)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(46, 49, 50)",
    inverseOnSurface: "rgb(239, 241, 242)",
    inversePrimary: "rgb(86, 214, 245)",
    elevation: {
      level0: "transparent",
      level1: "rgb(238, 245, 247)",
      level2: "rgb(231, 240, 244)",
      level3: "rgb(223, 236, 240)",
      level4: "rgb(221, 234, 238)",
      level5: "rgb(216, 231, 236)",
    },
    surfaceDisabled: "rgba(25, 28, 29, 0.12)",
    onSurfaceDisabled: "rgba(25, 28, 29, 0.38)",
    backdrop: "rgba(41, 50, 53, 0.4)",
  },
};

const DEFAULT_DARK = {
  colors: {
    primary: "rgb(86, 214, 245)",
    onPrimary: "rgb(0, 54, 65)",
    primaryContainer: "rgb(0, 78, 93)",
    onPrimaryContainer: "rgb(174, 236, 255)",
    secondary: "rgb(86, 214, 245)",
    onSecondary: "rgb(0, 54, 65)",
    secondaryContainer: "rgb(0, 78, 93)",
    onSecondaryContainer: "rgb(173, 236, 255)",
    tertiary: "rgb(186, 195, 255)",
    onTertiary: "rgb(23, 39, 120)",
    tertiaryContainer: "rgb(49, 63, 144)",
    onTertiaryContainer: "rgb(222, 224, 255)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(25, 28, 29)",
    onBackground: "rgb(225, 227, 228)",
    surface: "rgb(25, 28, 29)",
    onSurface: "rgb(225, 227, 228)",
    surfaceVariant: "rgb(63, 72, 75)",
    onSurfaceVariant: "rgb(191, 200, 203)",
    outline: "rgb(137, 146, 149)",
    outlineVariant: "rgb(63, 72, 75)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(225, 227, 228)",
    inverseOnSurface: "rgb(46, 49, 50)",
    inversePrimary: "rgb(0, 104, 123)",
    elevation: {
      level0: "transparent",
      level1: "rgb(28, 37, 40)",
      level2: "rgb(30, 43, 46)",
      level3: "rgb(32, 49, 53)",
      level4: "rgb(32, 50, 55)",
      level5: "rgb(34, 54, 59)",
    },
    surfaceDisabled: "rgba(225, 227, 228, 0.12)",
    onSurfaceDisabled: "rgba(225, 227, 228, 0.38)",
    backdrop: "rgba(41, 50, 53, 0.4)",
  },
};

function selectColorScheme(theme: AppTheme) {
  if (theme === "Dark") {
    return DEFAULT_DARK.colors;
  }

  if (theme === "Light") {
    return DEFAULT_LIGHT.colors;
  }

  return DEFAULT_DARK.colors;
}

export { selectColorScheme, DEFAULT_DARK, DEFAULT_LIGHT };
