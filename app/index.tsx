import { Redirect } from "expo-router";

/** The tab group owns the screens; "/" lands on the dashboard tab. */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
