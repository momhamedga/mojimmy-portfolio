"use client"
import { motion, MotionValue, useTransform } from "framer-motion";

export function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  // تدرج في الظهور والوضوح
  const opacity = useTransform(progress, range, [0.05, 1]);
  const y = useTransform(progress, range, [10, 0]);
  const blur = useTransform(progress, range, [8, 0]);

  return (
    <span className="relative inline-block ml-3 md:ml-6 mb-2">
      <motion.span 
        style={{ 
          opacity, 
          y,
          filter: useTransform(blur, (v) => `blur(${v}px)`) 
        }} 
        className="inline-block transition-colors duration-500 hover:text-[oklch(0.7_0.2_250)]"
      >
        {children}
      </motion.span>
    </span>
  );
}