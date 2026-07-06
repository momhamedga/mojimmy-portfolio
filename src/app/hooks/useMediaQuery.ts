"use client";
import { useCallback, useSyncExternalStore } from "react";

/**
 * تتبّع media query حقيقي عبر useSyncExternalStore — بديل نظيف عن
 * useState + useEffect(resize) وبيتفادى تحذير react-hooks/set-state-in-effect.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
