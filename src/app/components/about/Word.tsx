"use client";
import { motion, useTransform } from "framer-motion";

export const Word = ({ children, range, progress }: any) => {
  // تحسين: الكلمة تبدأ بـ 0.1 بدل 0 عشان تكون مقروءة خفيف قبل الـ Scroll
  const opacity = useTransform(progress, range, [0.1, 1]);
  
  return (
    <span className="relative mx-2 md:mx-3 mt-2 md:mt-4">
      <span className="absolute opacity-[0.03] text-white">{children}</span>
      <motion.span style={{ opacity }} className="text-white">
        {children}
      </motion.span>
    </span>
  );
};