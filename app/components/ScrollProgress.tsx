"use client"
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  // ضبط مرونة الخط (Spring) ليكون انسيابياً جداً
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // تدرج لوني يتغير من البداية للنهاية
  const color = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#3b82f6", "#a855f7", "#ec4899"]
  );

  return (
    <>
      {/* الخط النيون الأساسي */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[100000] pointer-events-none"
        style={{ 
          scaleX,
          backgroundColor: color,
          boxShadow: "0px 0px 8px rgba(168, 85, 247, 0.5)" // توهج بسيط ثابت
        }}
      />
      
      {/* تأثير التوهج الديناميكي (Glow) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[8px] origin-left z-[99999] pointer-events-none blur-[10px] opacity-40"
        style={{ 
          scaleX,
          backgroundColor: color 
        }}
      />
    </>
  );
}