"use client"
import { motion, MotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function AboutStats({ progress }: { progress: MotionValue<number> }) {
  const smoothWidth = useSpring(useTransform(progress, [0, 0.8], ["0%", "100%"]), {
    stiffness: 40,
    damping: 15
  });

  const [percent, setPercent] = useState(0);
  const percentage = useTransform(progress, [0, 0.8], [0, 100]);

  useEffect(() => {
    return percentage.onChange((v) => setPercent(Math.min(100, Math.max(0, Math.round(v)))));
  }, [percentage]);

  return (
    <div className="pt-12 space-y-6 border-t border-white/10 w-full max-w-sm" dir="rtl">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[oklch(0.7_0.2_285)] font-mono text-[10px] uppercase tracking-[0.4em] block font-bold">
            Execution Level
          </span>
          <span className="text-white/40 text-xs font-cairo">دقة التنفيذ الرقمي</span>
        </div>
        
        <div className="flex items-baseline">
          <motion.span className="text-white font-black text-5xl italic tracking-tighter leading-none">
            {percent}
          </motion.span>
          <span className="text-[oklch(0.7_0.2_285)] font-bold text-sm ml-1">%</span>
        </div>
      </div>
      
      {/* Liquid Progress Bar */}
      <div className="h-[4px] w-full bg-white/5 rounded-full relative overflow-visible">
        <motion.div 
          style={{ width: smoothWidth }}
          className="absolute inset-0 bg-[oklch(0.7_0.2_285)] blur-md opacity-30"
        />
        <motion.div 
          style={{ width: smoothWidth }}
          className="h-full bg-gradient-to-l from-[oklch(0.7_0.2_250)] via-[oklch(0.7_0.2_285)] to-[oklch(0.7_0.2_330)] relative z-10 rounded-full" 
        />
      </div>
      
      <div className="flex justify-between items-center text-[9px] tracking-[0.2em] uppercase font-bold text-white/20">
        <span>Concept</span>
        <span>Design</span>
        <span>Deployment</span>
      </div>
    </div>
  );
}