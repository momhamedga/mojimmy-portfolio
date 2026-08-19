"use client";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState, useCallback, useRef } from "react";

/**
 * إتاحة (Phase 4):
 * - الحركات المستمرة (اهتزاز السهم + شعاع اللمعة) تتوقف تحت prefers-reduced-motion.
 * - السكرول نفسه بيبقى فوريًا بدل smooth عند تقليل الحركة.
 * - الاهتزاز محروس بـ"vibrate" in navigator.
 * - العنصر 56×56 بالفعل — أكبر من الحد الأدنى 44×44.
 */
export default function MobileScrollTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const goingUp = latest < lastScrollY.current - 15;
    const next = latest > 500 && goingUp;
    if (next !== visible) setVisible(next);
    lastScrollY.current = latest;
  });

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    if ("vibrate" in navigator && !reduceMotion) navigator.vibrate(10);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.button
          type="button"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          aria-label="الرجوع لأعلى الصفحة"
          className="fixed bottom-10 left-6 w-14 h-14 rounded-2xl bg-surface/70 backdrop-blur-xl border border-border-strong/50 text-foreground flex items-center justify-center z-100 lg:hidden shadow-lg shadow-primary/10 active:scale-90 active:border-primary"
          style={{ touchAction: "manipulation" }}
        >
          {/* Glowing Aura */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-40 rounded-2xl"
          />

          <motion.span
            aria-hidden="true"
            animate={reduceMotion ? { y: 0 } : { y: [0, -4, 0] }}
            transition={{ duration: reduceMotion ? 0 : 2, repeat: reduceMotion ? 0 : Infinity }}
            className="relative flex"
          >
            <ArrowUp
              size={24}
              className="text-primary"
              style={{
                filter:
                  "drop-shadow(0 0 5px color-mix(in oklch, var(--color-primary) 50%, transparent))",
              }}
            />
          </motion.span>

          {/* Shine Ray — زخرفي بحت */}
          {!reduceMotion && (
            <motion.span
              aria-hidden="true"
              initial={{ left: "-100%" }}
              animate={{ left: "200%" }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="absolute top-0 w-8 h-full bg-foreground/5 skew-x-25 blur-sm"
            />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
