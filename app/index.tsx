import { Redirect, type Href } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useEqubStore } from "@/store";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const accessChecked = useEqubStore((state) => state.accessChecked);
  const role = useEqubStore((state) => state.role);
  if (!isLoaded) return null;
  if (isSignedIn && !accessChecked) return null;
  const destination: Href = isSignedIn ? role ? "/(tabs)" : "/access" as Href : "/sign-in" as Href;
  return <Redirect href={destination} />;
}
