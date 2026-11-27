"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHasMounted } from "../hooks/useHasMounted";

/**
 * تبديل الوضع الفاتح/الداكن — CSS خالص بدون `framer-motion`.
 * يحافظ على مساحة اللمس 44×44 وسمات الإتاحة واحترام `prefers-reduced-motion`.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    if (
      typeof window !== "undefined" &&
      "vibrate" in navigator &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
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
      <span className="flex items-center justify-center text-primary motion-safe:transition-transform motion-safe:duration-300">
        {isDark ? <Moon aria-hidden="true" size={16} /> : <Sun aria-hidden="true" size={16} />}
      </span>
    </button>
  );
}
