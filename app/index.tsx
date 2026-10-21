import { Redirect, type Href } from "expo-router";
import { useAuth } from "@clerk/expo";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  const destination: Href = isSignedIn ? "/(tabs)" : "/sign-in" as Href;
  return <Redirect href={destination} />;
}
