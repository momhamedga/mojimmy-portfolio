"use client";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHasMounted } from "../hooks/useHasMounted";

/**
 * إتاحة (Phase 4):
 * - مساحة اللمس بقت 44×44 (كانت 36×36) — الأيقونة نفسها ما اتغيّرتش.
 * - aria-label بيوصف **الإجراء** لا الحالة، وبيتغيّر حسب الوضع الحالي.
 * - aria-pressed بيعلن حالة الوضع الداكن.
 * - الحركة بتتوقف تحت prefers-reduced-motion.
 * - الاهتزاز محروس بـ"vibrate" in navigator وبيتخطّى نفسه في reduced motion.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();
  const reduceMotion = useReducedMotion();

  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator && !reduceMotion) {
      navigator.vibrate(10);
    }
    setTheme(isDark ? "light" : "dark");
  };

  // قبل الترطيب: عنصر نائب بنفس المقاس لمنع أي قفزة تخطيط
  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={cn("w-11 h-11 rounded-full bg-surface border border-border", className)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "التبديل للوضع الفاتح" : "التبديل للوضع الداكن"}
      aria-pressed={isDark}
      className={cn(
        "relative w-11 h-11 rounded-full bg-surface border border-border-strong/50 flex items-center justify-center overflow-hidden transition-colors hover:border-primary active:scale-90 cursor-pointer",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={reduceMotion ? false : { opacity: 0, rotate: -90, scale: 0.4 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, rotate: 90, scale: 0.4 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center text-primary"
        >
          {isDark ? <Moon aria-hidden="true" size={16} /> : <Sun aria-hidden="true" size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
