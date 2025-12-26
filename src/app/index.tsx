import { Redirect } from "expo-router";
import { useUserFirstTimeStore } from "@/store/useUserFirstTimeStore";

export default function Page() {
  const { firstTimer } = useUserFirstTimeStore();

  if (firstTimer) return <Redirect href="/(auth)/welcome" />;

  return <Redirect href="/(root)/(tabs)/home" />;
}
