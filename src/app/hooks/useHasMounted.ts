"use client";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * بديل آمن لنمط "useState(false) + useEffect(() => setState(true))"
 * لمعرفة هل الهيدريشن خلص ولا لسه — بدون استدعاء setState جوّه useEffect.
 */
export function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
