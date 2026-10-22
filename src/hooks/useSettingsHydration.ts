import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

export function useSettingsHydration(): boolean {
  const [hydrated, setHydrated] = useState(() => useSettingsStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    const finish = () => {
      if (useSettingsStore.persist.hasHydrated()) setHydrated(true);
    };
    const unsubscribe = useSettingsStore.persist.onFinishHydration(finish);
    finish();
    return unsubscribe;
  }, [hydrated]);

  return hydrated;
}
