"use client"
import { motion, MotionValue, useTransform } from "framer-motion";

interface WordProps {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}

export function Word({ children, range, progress }: WordProps) {
  // تحويل مدى السكرول لحالات بصرية
  const opacity = useTransform(progress, range, [0.08, 1]);
  const scale = useTransform(progress, range, [0.92, 1]);
  const blur = useTransform(progress, range, [4, 0]); // تحويل لـ number لسهولة المعالجة

  return (
    <span className="relative inline-block mr-3 md:mr-5">
      {/* نسخة باهتة جداً خلف الكلمة عشان تحافظ على شكل الجملة قبل الظهور */}
      <span className="absolute opacity-[0.02] text-white tracking-tighter">
        {children}
      </span>
      
      <motion.span 
        style={{ 
          opacity, 
          scale, 
          filter: `blur(${blur}px)` 
        }} 
        className="text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.2)] tracking-tighter"
      >
        {children}
      </motion.span>
    </span>
  );
}