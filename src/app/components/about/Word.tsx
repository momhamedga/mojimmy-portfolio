"use client";
import { motion, MotionValue, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface WordProps {
  children: ReactNode;
  range: [number, number];
  progress: MotionValue<number>;
}

export const Word = ({ children, range, progress }: WordProps) => {
  // تحسين: الكلمة تبدأ بـ 0.1 بدل 0 عشان تكون مقروءة خفيف قبل الـ Scroll
  const opacity = useTransform(progress, range, [0.1, 1]);
  
  return (
    <span className="relative mx-2 md:mx-3 mt-2 md:mt-4">
      <span className="absolute opacity-[0.03] text-foreground">{children}</span>
      <motion.span style={{ opacity }} className="text-foreground">
        {children}
      </motion.span>
    </span>
  );
};