import { useEffect } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconButton, useTheme } from "react-native-paper";
import { Tabs, usePathname, useRouter } from "expo-router";
import {
  BanknoteIcon,
  ChartPieIcon,
  House,
  SettingsIcon,
} from "lucide-react-native";

import { useSelectedBudgets } from "@/store/useSelectedBudgets";
import { useSelectedTransactions } from "@/store/useSelectedTransactions";

import AccountMiniViewer from "@/src/components/reusables/account-mini-viewer";
import TransactionHeaderBar from "@/src/components/home/transaction-header-bar";
import BudgetTransactionHeaderBar from "@/src/components/budgets/budget-header-bar";

export default function Layout() {
  const theme = useTheme();
  const pathname = usePathname();

  const { selectedBudgets, setSelectedBudgets } = useSelectedBudgets();
  const { selectedTransactions, setSelectedTransactions } =
    useSelectedTransactions();

  const isOverlayActive = selectedBudgets.length || selectedTransactions.length;

  useEffect(() => {
    setSelectedBudgets([]);
    setSelectedTransactions([]);
  }, [pathname]);

  return (
    <View style={{ flex: 1, paddingTop: 8 }}>
      <AppHeader
        isOverlayActive={Boolean(isOverlayActive)}
        budgetOverlayActive={Boolean(selectedBudgets.length)}
        transactionOverlayActive={Boolean(selectedTransactions.length)}
      />

      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: theme.colors.onPrimary,
          tabBarActiveBackgroundColor: theme.colors.primary,
          tabBarInactiveBackgroundColor: theme.colors.elevation.level3,
          tabBarInactiveTintColor: theme.colors.onSurface,
          tabBarStyle: {
            backgroundColor: theme.colors.elevation.level1,
            height: 52,
            marginHorizontal: 50,
            bottom: 16,
            elevation: 0,
            shadowOpacity: 0,
            position: "absolute",
            borderRadius: 12,
            overflow: "hidden",
            alignItems: "center",
            paddingHorizontal: 5,
            borderTopWidth: 1,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
            zIndex: 10,
            display: isOverlayActive ? "none" : "flex",
          },
          tabBarItemStyle: {
            overflow: "hidden",
            borderRadius: 9,
            height: 40,
            marginTop: 5,
            width: 60,
          },
          tabBarLabelStyle: {
            fontFamily: "Manrope-Bold",
            fontSize: 10,
          },
          sceneStyle: {
            backgroundColor: theme.colors.background,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: (props) => (
              <House
                size={20}
                color={props.color}
                strokeWidth={1.5}
                fillOpacity={props.focused ? 0.3 : 0}
                fill={
                  props.focused
                    ? theme.colors.onPrimary
                    : theme.colors.background
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            tabBarIcon: (props) => (
              <ChartPieIcon
                size={20}
                color={props.color}
                strokeWidth={1.5}
                fillOpacity={props.focused ? 0.3 : 0}
                fill={
                  props.focused
                    ? theme.colors.onPrimary
                    : theme.colors.background
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: "Budgets",
            tabBarIcon: (props) => (
              <BanknoteIcon
                size={28}
                color={props.color}
                strokeWidth={1.2}
                fillOpacity={props.focused ? 0.3 : 0}
                fill={
                  props.focused
                    ? theme.colors.onPrimary
                    : theme.colors.background
                }
              />
            ),
          }}
        />
      </Tabs>

      <LinearGradient
        colors={[theme.colors.background, "transparent"]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 1,
          left: 0,
          width: "100%",
          height: 100,
        }}
      />
    </View>
  );
}

type AppHeaderProps = {
  isOverlayActive: boolean;
  budgetOverlayActive: boolean;
  transactionOverlayActive: boolean;
};

function AppHeader({
  budgetOverlayActive,
  isOverlayActive,
  transactionOverlayActive,
}: AppHeaderProps) {
  const theme = useTheme();
  const router = useRouter();

  const headerOverlayContent = () => {
    if (budgetOverlayActive) return <BudgetTransactionHeaderBar />;
    if (transactionOverlayActive) return <TransactionHeaderBar />;
  };

  return (
    <View
      style={{
        height: 64,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 16,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          opacity: isOverlayActive ? 0 : 1,
        }}
      >
        <AccountMiniViewer />

        <IconButton
          mode="contained-tonal"
          onPress={() => router.push("/(root)/settings")}
          icon={(props) => (
            <SettingsIcon
              strokeWidth={1.5}
              color={props.color}
              size={props.size}
            />
          )}
        />
      </View>

      {headerOverlayContent()}
    </View>
  );
}
