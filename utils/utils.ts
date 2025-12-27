import { CurrencyCode, currencySymbols } from "@/constants/currency-symbols";
import { Easing } from "react-native-reanimated";

type CardBorderRadius = Record<
  CardPositionsTypes,
  { tl: number; tr: number; bl: number; br: number }
>;

export const cardBorderRadius: CardBorderRadius = {
  first: {
    tl: 10,
    tr: 10,
    bl: 4,
    br: 4,
  },
  middle: {
    tl: 4,
    tr: 4,
    bl: 4,
    br: 4,
  },
  last: {
    tl: 4,
    tr: 4,
    bl: 10,
    br: 10,
  },
  only: {
    tl: 10,
    tr: 10,
    bl: 10,
    br: 10,
  },
};

// Simple color mapping per category type
export const transactionColorMap: Record<
  "income" | "expense" | "transfer",
  string
> = {
  income: "rgba(51, 206, 46, 1)",
  expense: "rgba(248, 81, 30, 1)",
  transfer: "rgba(96, 118, 216, 1)",
};

export function getCardPosition(
  index: number,
  length: number,
): "only" | "first" | "middle" | "last" {
  if (length === 1) return "only";
  if (index === 0) return "first";
  if (index === length - 1) return "last";
  return "middle";
}

export function formatCurrencyByCode(
  value: number,
  code: CurrencyCode,
  showFraction: boolean,
  accountingStyle: boolean,
  showSuffix: boolean,
) {
  const match = currencySymbols.find((c) => c.code === code);
  const abs = Math.abs(value);

  if (showSuffix) {
    let newValue, suffix;

    if (abs >= 1_000_000_000) {
      newValue = value / 1_000_000_000;
      suffix = "B";
    } else if (abs >= 1_000_000) {
      newValue = value / 1_000_000;
      suffix = "M";
    } else if (abs >= 1_000) {
      newValue = value / 1_000;
      suffix = "K";
    } else {
      newValue = value;
      suffix = "";
    }

    return (
      new Intl.NumberFormat(match?.locale || "id-ID", {
        style: "currency",
        currency: match?.code || "IDR",
        currencySign: accountingStyle ? "accounting" : "standard",
        maximumSignificantDigits: 3,
      }).format(newValue) + suffix
    );
  }

  return new Intl.NumberFormat(match?.locale || "id-ID", {
    style: "currency",
    currency: match?.code || "IDR",
    currencySign: accountingStyle ? "accounting" : "standard",
    maximumFractionDigits: showFraction ? 2 : 0,
  }).format(value);
}

export const fastSpatialEasing: any = Easing.bezier(0.42, 1.67, 0.21, 0.9);
