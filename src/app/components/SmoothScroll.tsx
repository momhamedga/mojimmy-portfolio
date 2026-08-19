"use client";

import { ReactLenis } from "lenis/react";
import { memo, useEffect, useState, type ReactNode } from "react";

/**
 * محرك السكرول الناعم (Lenis).
 *
 * قرار Phase 3: KEEP — الأدلة في التقرير. باختصار: Lenis جزء من هوية الموقع
 * الحركية، والـ Navbar بيستخدم `lenis.scrollTo` للتنقّل بين الأقسام، ومحاكاة
 * نفس الإحساس بـ CSS وحدها غير ممكنة.
 *
 * التحسين المضاف: احترام prefers-reduced-motion. المستخدم اللي طالب تقليل
 * الحركة بياخد السكرول الأصلي للمتصفح (Lenis مش بيتركّب أصلًا)، فبيتوفّر
 * كمان الـ rAF loop بتاعه بالكامل.
 */
const LENIS_OPTIONS = {
  duration: 1.2,
  lerp: 0.1,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.5,
  smoothWheel: true,
  infinite: false,
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  syncTouch: false,
  autoRaf: true,
};

const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  const content = <div className="transition-colors duration-2000 ease-in-out">{children}</div>;

  if (reduceMotion) return content;

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {content}
    </ReactLenis>
  );
};

export default memo(SmoothScroll);
