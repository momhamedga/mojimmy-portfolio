"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { setSectionScroller } from "@/app/hooks/use-active-section";

/**
 * إعدادات Lenis لسطح المكتب — مفعّلة فقط عند `(min-width: 768px) and (pointer: fine)`
 * ومع `prefers-reduced-motion: no-preference`.
 */
const LENIS_OPTIONS = {
  lerp: 0.15,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.5,
  smoothWheel: true,
  infinite: false,
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  syncTouch: false,
  autoRaf: true,
};

function LenisScrollerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) {
      setSectionScroller(null);
      return;
    }

    setSectionScroller((target, { immediate }) => {
      const isTop = typeof target === "number";
      const dest = isTop ? target : `#${target}`;

      if (immediate) {
        // استعادة التاريخ: إيقاف الحركة الجارية أولًا حتى لا تواصل نحو هدف قديم.
        lenis.stop();
        lenis.scrollTo(dest, {
          offset: isTop ? 0 : -80,
          immediate: true,
          force: true,
        });
        lenis.start();
        return;
      }

      lenis.scrollTo(dest, {
        offset: isTop ? 0 : -80,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    });

    return () => setSectionScroller(null);
  }, [lenis]);

  return null;
}

export default function LenisSmoothScroll() {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <LenisScrollerBridge />
    </ReactLenis>
  );
}
