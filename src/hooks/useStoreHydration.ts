import { useEffect, useState } from "react";
import { useEqubStore } from "@/store/useEqubStore";
import { useSettingsStore } from "@/store/useSettingsStore";

/**
 * True once both persisted Zustand stores have rehydrated from AsyncStorage.
 * The root layout gates rendering on this so screens never flash the demo
 * seed state (or the wrong theme/language) before stored data loads.
 */
export function useStoreHydration(): boolean {
  const [hydrated, setHydrated] = useState(
    () => useEqubStore.persist.hasHydrated() && useSettingsStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (hydrated) return;
    const check = () => {
      if (useEqubStore.persist.hasHydrated() && useSettingsStore.persist.hasHydrated()) setHydrated(true);
    };
    const unsubEqub = useEqubStore.persist.onFinishHydration(check);
    const unsubSettings = useSettingsStore.persist.onFinishHydration(check);
    check();
    return () => {
      unsubEqub();
      unsubSettings();
    };
  }, [hydrated]);

  return hydrated;
}
