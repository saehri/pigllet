import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Marquee } from "@animatereactnative/marquee";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Text, useTheme } from "react-native-paper";

import { useAppThemeStore } from "@/store/useAppThemeStore";
import { incomeCategories } from "@/constants/income-category";
import { expenseCategories } from "@/constants/expense-category";
import { transferCategories } from "@/constants/transfer-category";
import { useTransactionCategoryStore } from "@/store/useTransactionCategoryStore";

const images: ImageSourcePropType[] = [
  require("@/assets/images/onboarding/1.jpeg"),
  require("@/assets/images/onboarding/2.jpeg"),
  require("@/assets/images/onboarding/3.jpeg"),
  require("@/assets/images/onboarding/4.jpeg"),
  require("@/assets/images/onboarding/5.jpeg"),
];

const { width } = Dimensions.get("screen");
const _itemWidth = width * 0.62;
const _itemHeight = _itemWidth * 2.22;
const _spacing = 16;
const _itemSize = _itemWidth + _spacing;

type ItemProps = {
  image: ImageSourcePropType;
  index: number;
  offset: SharedValue<number>;
};

function Item({ image, index, offset }: ItemProps) {
  const _styles = useAnimatedStyle(() => {
    const itemPosition = index * _itemSize - width - _itemSize / 2;
    const totalSize = images.length * _itemSize;

    const range =
      ((itemPosition - (offset.value + totalSize * 1000)) % totalSize) +
      width +
      _itemSize / 2;

    return {
      transform: [
        {
          rotate: `${interpolate(range, [-_itemSize, (width - _itemSize) / 2, width], [-3, 0, 3])}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: _itemWidth,
          height: _itemHeight,
          borderRadius: 16,
        },
        _styles,
      ]}
    >
      <Image
        source={image}
        style={{
          flex: 1,
          borderRadius: 16,
          width: "100%",
          height: "100%",
        }}
      />
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const offset = useSharedValue(0);
  const { setAppTheme } = useAppThemeStore();
  const { isLoading, addNewCategory } = useTransactionCategoryStore();

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setAppTheme("Light");
  }, []);

  useAnimatedReaction(
    () => {
      const floatIndex = (offset.value / _itemSize) % images.length;
      return Math.abs(Math.floor(floatIndex));
    },
    (value) => {
      runOnJS(setActiveIndex)(value);
    },
  );

  async function setMyApp() {
    try {
      const createdAt = new Date().toISOString();

      // 1. Define the promises
      const expensePromise = addNewCategory(
        expenseCategories.map((category) => ({
          type: "expense",
          label: category.label,
          icon_name: category.icon,
          budget_id: null,
          created_at: createdAt,
          is_default: 1,
        })),
      );

      const incomePromise = addNewCategory(
        incomeCategories.map((category) => ({
          label: category.label,
          icon_name: category.icon,
          created_at: createdAt,
          type: "income",
          is_default: 1,
        })),
      );

      const transferPromise = addNewCategory(
        transferCategories.map((category) => ({
          label: category.label,
          icon_name: category.icon,
          created_at: createdAt,
          type: "transfer",
          is_default: 1,
        })),
      );

      // 2. Execute them concurrently and wait for all to finish
      await Promise.all([expensePromise, incomePromise, transferPromise]);
      router.push("/(auth)/account-setup");
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={[StyleSheet.absoluteFillObject]}>
        <Animated.Image
          key={activeIndex}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}
          source={images[activeIndex]}
          style={{ flex: 1, width: "100%", height: "100%", opacity: 0.8 }}
          blurRadius={50}
        />
      </View>

      <Marquee spacing={_spacing} position={offset}>
        <View
          style={{
            flexDirection: "row",
            gap: _spacing,
          }}
        >
          {images.map((image, index) => (
            <Item
              key={`image-${index}`}
              image={image}
              index={index}
              offset={offset}
            />
          ))}
        </View>
      </Marquee>

      <View
        style={{
          padding: 16,
          paddingBottom: 48,
          width: "100%",
          marginTop: 18,
          gap: 10,
          justifyContent: "flex-end",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            variant="headlineMedium"
            style={{ fontFamily: "Manrope-Bold", textAlign: "center" }}
          >
            Welcome to Pigllet!
          </Text>

          <Text
            variant="bodyLarge"
            style={{
              fontFamily: "Manrope-Regular",
              opacity: 0.7,
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            Your simple way to manage money and stay in control.
          </Text>
        </View>

        <LinearGradient
          colors={[
            theme.colors.primary,
            theme.colors.secondary,
            theme.colors.tertiary,
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            alignItems: "center",
            marginTop: 16,
            height: 49,
            borderRadius: 100,
          }}
        >
          <Button
            mode="contained"
            onPress={setMyApp}
            style={{ marginTop: 0, height: 48, backgroundColor: "transparent" }}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontFamily: "Manrope-Medium", fontSize: 16 }}
            disabled={isLoading}
            loading={isLoading}
          >
            Get started
          </Button>
        </LinearGradient>
      </View>
    </View>
  );
}
