"use client"
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // 1. Spring Physics: جعل الحركة تبدو وكأنها سائلة (Fluid)
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 2. Transformations: تحويل البروجرس لقيم بصرية
  // نستخدم scaleX بدلاً من scrollYProgress للنقطة عشان تلاحق الخط بنعومة
  const leftPos = useTransform(scaleX, (s) => `${s * 100}%`);
  const opacityVal = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  
  // تأثير عرض الخط: يبدأ نحيف جداً ويعرض قليلاً مع السكرول
  const heightVal = useTransform(scrollYProgress, [0, 1], ["2px", "4px"]);

  // التحقق من البيئة (Client-side check)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
      {/* 1. الخط الأساسي مع التوهج (The Glowing Line) */}
      <motion.div
        className="absolute top-0 left-0 right-0 origin-left bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400"
        style={{ 
            scaleX, 
            height: heightVal,
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)"
        }}
      />

      {/* 2. النقطة القائدة (The Cinematic Leader) */}
      {!isMobile && (
        <motion.div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
          style={{
            left: leftPos,
            opacity: opacityVal
          }}
        >
          {/* النقطة المضيئة */}
          <div className="w-1.5 h-4 bg-white rounded-full shadow-[0_0_15px_2px_white] blur-[0.5px]" />
          
          {/* كشاف الضوء النازل (Flare effect) */}
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      )}

      {/* 3. تأثير الـ Glassmorphism الخلفي للخط (اختياري للفخامة) */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-white/[0.02] backdrop-blur-[1px] -z-10" />
    </div>
  );
}