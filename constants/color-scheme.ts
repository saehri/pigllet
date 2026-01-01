const DEFAULT_LIGHT = {
  colors: {
    primary: "rgb(131, 71, 143)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(253, 214, 255)",
    onPrimaryContainer: "rgb(52, 0, 65)",
    secondary: "rgb(144, 53, 167)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(253, 214, 255)",
    onSecondaryContainer: "rgb(52, 0, 66)",
    tertiary: "rgb(102, 96, 0)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(239, 231, 108)",
    onTertiaryContainer: "rgb(30, 28, 0)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(30, 26, 30)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(30, 26, 30)",
    surfaceVariant: "rgb(236, 223, 233)",
    onSurfaceVariant: "rgb(77, 68, 76)",
    outline: "rgb(126, 116, 125)",
    outlineVariant: "rgb(207, 195, 205)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(51, 47, 50)",
    inverseOnSurface: "rgb(247, 238, 243)",
    inversePrimary: "rgb(244, 174, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(249, 242, 249)",
      level2: "rgb(245, 237, 246)",
      level3: "rgb(241, 231, 243)",
      level4: "rgb(240, 229, 242)",
      level5: "rgb(238, 226, 239)",
    },
    surfaceDisabled: "rgba(30, 26, 30, 0.12)",
    onSurfaceDisabled: "rgba(30, 26, 30, 0.38)",
    backdrop: "rgba(54, 46, 54, 0.4)",
  },
};

const DEFAULT_DARK = {
  colors: {
    primary: "rgb(244, 174, 255)",
    onPrimary: "rgb(79, 21, 93)",
    primaryContainer: "rgb(104, 46, 117)",
    onPrimaryContainer: "rgb(253, 214, 255)",
    secondary: "rgb(244, 174, 255)",
    onSecondary: "rgb(85, 0, 106)",
    secondaryContainer: "rgb(117, 21, 141)",
    onSecondaryContainer: "rgb(253, 214, 255)",
    tertiary: "rgb(210, 202, 83)",
    onTertiary: "rgb(52, 50, 0)",
    tertiaryContainer: "rgb(76, 72, 0)",
    onTertiaryContainer: "rgb(239, 231, 108)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(30, 26, 30)",
    onBackground: "rgb(232, 224, 228)",
    surface: "rgb(30, 26, 30)",
    onSurface: "rgb(232, 224, 228)",
    surfaceVariant: "rgb(77, 68, 76)",
    onSurfaceVariant: "rgb(207, 195, 205)",
    outline: "rgb(152, 141, 151)",
    outlineVariant: "rgb(77, 68, 76)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(232, 224, 228)",
    inverseOnSurface: "rgb(51, 47, 50)",
    inversePrimary: "rgb(131, 71, 143)",
    elevation: {
      level0: "transparent",
      level1: "rgb(41, 33, 41)",
      level2: "rgb(47, 38, 48)",
      level3: "rgb(54, 42, 55)",
      level4: "rgb(56, 44, 57)",
      level5: "rgb(60, 47, 62)",
    },
    surfaceDisabled: "rgba(232, 224, 228, 0.12)",
    onSurfaceDisabled: "rgba(232, 224, 228, 0.38)",
    backdrop: "rgba(54, 46, 54, 0.4)",
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
