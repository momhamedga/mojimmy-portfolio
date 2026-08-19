"use client";
import { motion } from "framer-motion";
import { useCustomCursor } from "../hooks/use-custom-cursor";

/**
 * اتشال AnimatePresence و mounted state: المكوّن ما بيترسمش أصلًا إلا بعد أول
 * حركة فأرة على جهاز بمؤشر دقيق، فما كانش فيه أي حاجة تعمل لها exit animation.
 */
export default function CustomCursor() {
  const { enabled, isVisible, hoverState, x, y, trailX, trailY } = useCustomCursor();

  if (!enabled || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-99999 overflow-hidden" aria-hidden="true">
      {/* 1. الهالة الخارجية (The Modern Aura) */}
      <motion.div
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 flex items-center justify-center"
      >
        <motion.div
          animate={{
            width: hoverState.active ? 80 : 45,
            height: hoverState.active ? 80 : 45,
            rotate: hoverState.active ? 180 : 0,
            borderColor: hoverState.active
              ? "color-mix(in oklch, var(--color-primary) 50%, transparent)"
              : "color-mix(in oklch, var(--color-foreground) 20%, transparent)",
          }}
          className="rounded-full border border-dashed"
        />
      </motion.div>

      {/* 2. النواة المركزية (The Core Dot) */}
      <motion.div
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 flex items-center justify-center mix-blend-difference"
      >
        <motion.div
          animate={{ scale: hoverState.active ? 2.5 : 1 }}
          className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center"
        >
          {hoverState.active && hoverState.text && (
            <span className="text-[3px] font-black text-black tracking-widest">
              {hoverState.text}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* 3. تأثير الـ Glow الجانبي (Subtle Glow) */}
      <motion.div
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full -z-10"
        animate={{ opacity: hoverState.active ? 0.8 : 0.3 }}
      />
    </div>
  );
}
