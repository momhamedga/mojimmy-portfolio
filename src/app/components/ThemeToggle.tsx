"use client";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useHasMounted } from "../hooks/useHasMounted";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  // منع أي Hydration Mismatch: next-themes بيحسم الوضع الفعلي على المتصفح بس
  const mounted = useHasMounted();

  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(10);
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={cn("w-9 h-9 rounded-full bg-surface border border-border", className)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "التبديل للوضع الفاتح" : "التبديل للوضع الداكن"}
      className={cn(
        "relative w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden transition-colors hover:border-primary/40 active:scale-90 cursor-pointer",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center text-primary"
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
