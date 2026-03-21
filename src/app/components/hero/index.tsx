"use client"
import { useRef, memo, useEffect, useState, useCallback, ReactNode } from "react";
import { BackgroundEffect } from "./BackgroundEffect";
import { HeroContent } from "./HeroContent";
import { HeroActions } from "./HeroActions";
import { motion } from "framer-motion";
import { useMousePosition } from "../../hooks/useMousePosition";

interface HeroProps {
  onStartProject: () => void;
}

const Hero = memo(({ onStartProject }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // 1. تعريف صريح جداً للـ State والـ Setter لمنع تعارض الأسماء
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // 2. مناداة الـ Hook الأساسي في القمة دائمًا
  const { springX, springY, updateMousePosition } = useMousePosition();

  useEffect(() => {
    // استخدام دالة لضمان أن التحديث يتم بعد الرندر الأول تماماً
    const activateMount = () => setIsMounted(true);
    activateMount();

    return () => setIsMounted(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    updateMousePosition(e, sectionRef);
  }, [updateMousePosition]);

  return (
    <section 
      ref={sectionRef}
      id="home"
      dir="rtl"
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden  select-none"
    >
      {/* الحل الجذري: استخدام التقييم الشرطي داخل الـ JSX لضمان سلامة الـ Hooks */}
      {isMounted && (
        <>
          {/* تأثير الخلفية */}
          <BackgroundEffect springX={springX} springY={springY} />
          
          {/* حاوية المحتوى */}
          <div className="relative z-20 container mx-auto px-6 max-w-5xl flex flex-col items-center text-center">
            <HeroContent />
            <HeroActions onStartProject={onStartProject} />
          </div>

          {/* مؤشر النزول - Optimized for GPU */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-10 flex flex-col items-center gap-3 hidden md:flex pointer-events-none"
          >
            <span className="font-mono text-[10px] tracking-[0.4em] text-gray-500 uppercase italic">
              اسحب للأسفل
            </span>
            <div className="relative w-[1px] h-16 bg-white/5 overflow-hidden rounded-full">
              <motion.div 
                animate={{ 
                  y: ["-100%", "100%"],
                  opacity: [0, 1, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="w-full h-1/2 bg-gradient-to-b from-transparent via-purple-500 to-transparent"
                style={{ willChange: "transform" }}
              />
            </div>
          </motion.div>

          {/* تأثيرات الإضاءة المحيطة */}
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-purple-600/10 to-transparent pointer-events-none md:hidden" />
          <div className="absolute -left-[10%] top-1/4 w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -right-[10%] bottom-1/4 w-[40%] h-[40%] bg-pink-600/5 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

      {/* شاشة تحميل بسيطة جداً تظهر فقط قبل الـ Hydration */}
      {!isMounted && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030303]">
          <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;