import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function StatisticsScreenLayout() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, "transparent"]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          zIndex: 1,
          left: 0,
          width: "100%",
          height: 70,
        }}
      />

      <Tabs
        initialRouteName="stats-by-week"
        screenOptions={{
          tabBarActiveTintColor: theme.colors.onPrimary,
          tabBarActiveBackgroundColor: theme.colors.primary,
          tabBarInactiveBackgroundColor: theme.colors.elevation.level3,
          tabBarInactiveTintColor: theme.colors.onSurface,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0)",
            top: 4,
            borderTopWidth: 0,
            marginHorizontal: 16,
            elevation: 0,
            shadowOpacity: 0,
            gap: 12,
            borderRadius: 8,
            height: 40,
            zIndex: 10,
            display: "none",
          },
          tabBarLabelStyle: {
            fontFamily: "Manrope-Medium",
            fontSize: 14,
          },
          headerTitleStyle: {
            fontFamily: "Manrope-Bold",
            textTransform: "capitalize",
            letterSpacing: -1,
          },
          tabBarItemStyle: {
            overflow: "hidden",
            borderRadius: 12,
            height: 40,
          },
          sceneStyle: {
            backgroundColor: theme.colors.background,
          },
          tabBarLabelPosition: "beside-icon",
          tabBarIconStyle: {
            display: "none",
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen name="stats-by-week" options={{ title: "Week" }} />
        <Tabs.Screen name="stats-by-month" options={{ title: "Month" }} />
        <Tabs.Screen name="stats-by-year" options={{ title: "Year" }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
