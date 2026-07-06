"use client"
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { useRef } from "react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // 1. Refs للتحكم المباشر في العناصر (Direct GPU Access)
  const leaderRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // 2. Spring Physics لنعومة الحركة
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 3. مراقبة التغيير وتحديث الـ Refs بدون Re-render
  useMotionValueEvent(scaleX, "change", (latest) => {
    const percentage = latest * 100;
    
    // تحديث مكان النقطة القائدة
    if (leaderRef.current) {
      leaderRef.current.style.left = `${percentage}%`;
      // تأثير بصري: النقطة "تتمط" (Stretch) كل ما السكرول كان أسرع
      leaderRef.current.style.transform = `translateX(-50%) scaleY(${1 + latest * 0.2})`;
    }

    // تحديث سمك الخط تدريجياً
    if (lineRef.current) {
      const thickness = 2 + (latest * 2); // من 2px لـ 4px
      lineRef.current.style.height = `${thickness}px`;
    }
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-99999 pointer-events-none">
      {/* 1. الخط الأساسي (The Glowing Line) */}
      <motion.div
        ref={lineRef}
        className="absolute top-0 left-0 right-0 origin-left bg-linear-to-r from-primary via-accent to-primary"
        style={{
            scaleX,
            boxShadow: "0 0 20px color-mix(in oklch, var(--color-primary) 40%, transparent)"
        }}
      />

      {/* 2. النقطة القائدة (The Cinematic Leader) - محكومة بـ Ref */}
      <div
        ref={leaderRef}
        className="absolute top-0 -translate-x-1/2 flex flex-col items-center hidden md:flex transition-opacity duration-500"
        style={{ left: '0%' }}
      >
        {/* النقطة المضيئة بتوهج OKLCH نقي */}
        <div className="w-1.5 h-4 bg-white rounded-full shadow-[0_0_15px_2px_#fff] blur-[0.2px]" />
        
        {/* كشاف الضوء النازل (Flare effect) */}
        <div className="w-px h-20 bg-linear-to-b from-white/40 via-white/5 to-transparent" />
      </div>

      {/* 3. خلفية Glassmorphism خفيفة جداً لتعزيز العمق */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-foreground/3 backdrop-blur-[2px] -z-10" />
    </div>
  );
}