import { cardBorderRadius } from "@/utils/utils";
import { ChevronsUpDown } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = {
  label: string;
  description?: string;
  buttonRightTitle?: string;
  buttonRight?: React.ReactNode;
  onPress?: () => void;
  higlight?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  position: CardPositionsTypes;
  customActiveColor?: string;
  customInactiveColor?: string;
};

export default function SettingContentButton({
  buttonRightTitle,
  label,
  buttonRight,
  onPress,
  higlight,
  contentStyle = {},
  labelStyle = {},
  position,
  description,
  customActiveColor,
  customInactiveColor,
}: Props) {
  const theme = useTheme();

  const cardRadiusStyle = useMemo(
    () => ({
      borderTopLeftRadius: cardBorderRadius[position].tl,
      borderTopRightRadius: cardBorderRadius[position].tr,
      borderBottomLeftRadius: cardBorderRadius[position].bl,
      borderBottomRightRadius: cardBorderRadius[position].br,
    }),
    [position],
  );

  const renderDescription = useCallback(() => {
    if (description)
      return (
        <Text variant="labelSmall" style={styles.description}>
          {description}
        </Text>
      );

    return <></>;
  }, []);

  const renderButtonRight = useCallback(() => {
    if (buttonRight) return buttonRight;

    return (
      <View style={styles.buttonRight}>
        <Text variant="bodyLarge" style={{ fontFamily: "Manrope-Light" }}>
          {buttonRightTitle}
        </Text>
        <ChevronsUpDown
          strokeWidth={1.5}
          size={18}
          color={theme.colors.onBackground}
        />
      </View>
    );
  }, [buttonRight]);

  return (
    <Pressable
      style={[
        styles.container,
        cardRadiusStyle,
        {
          ...(contentStyle as object),
          backgroundColor: higlight
            ? customActiveColor || theme.colors.tertiaryContainer
            : customInactiveColor || theme.colors.elevation.level3,
          borderWidth: 1,
          borderColor: higlight
            ? theme.colors.tertiary
            : theme.colors.elevation.level5,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.infoContainer}>
        <Text
          variant="bodyLarge"
          style={{
            fontFamily: "Manrope-Regular",
            ...(labelStyle as object),
            color: theme.colors.onSurface,
          }}
        >
          {label}
        </Text>

        {renderDescription()}
      </View>

      {renderButtonRight()}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    padding: 16,
    alignItems: "center",
  },
  buttonRight: {
    flexDirection: "row",
    gap: 2,
    opacity: 0.6,
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  description: {
    fontFamily: "Manrope-Light",
    opacity: 0.7,
  },
});
