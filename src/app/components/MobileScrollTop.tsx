"use client";
import { ArrowUp } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * زر الرجوع لأعلى الصفحة على الموبايل — CSS + passive scroll بدون `framer-motion`
 * أو حلقات حركة لا نهائية.
 */
export default function MobileScrollTop() {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const latest = window.scrollY;
      const goingUp = latest < lastScrollY.current - 15;
      const next = latest > 500 && goingUp;
      lastScrollY.current = latest;
      if (next !== visibleRef.current) {
        visibleRef.current = next;
        setVisible(next);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("vibrate" in navigator && !reduceMotion) navigator.vibrate(10);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="الرجوع لأعلى الصفحة"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-10 left-6 w-14 h-14 rounded-2xl bg-surface/70 backdrop-blur-xl border border-border-strong/50 text-foreground flex items-center justify-center z-100 lg:hidden shadow-lg shadow-primary/10 active:scale-90 active:border-primary",
        "motion-safe:transition-[opacity,transform] motion-safe:duration-200",
        visible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-75 translate-y-5 pointer-events-none",
      )}
      style={{ touchAction: "manipulation" }}
    >
      {/* Glowing Aura */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-40 rounded-2xl"
      />

      <span aria-hidden="true" className="relative flex">
        <ArrowUp
          size={24}
          className="text-primary"
          style={{
            filter:
              "drop-shadow(0 0 5px color-mix(in oklch, var(--color-primary) 50%, transparent))",
          }}
        />
      </span>
    </button>
  );
}
