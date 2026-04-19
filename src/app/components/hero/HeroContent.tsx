"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";

export const HeroContent = () => {
  const glowRef = useRef<HTMLDivElement>(null); 
  const { scrollY } = useScroll();
  
  // تحريك النص الخلفي فقط في الكمبيوتر لتقليل جهد الموبايل
  const ghostY = useSpring(useTransform(scrollY, [0, 500], [0, -80]), { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current || window.innerWidth < 768) return;
      const { clientX, clientY } = e;
      requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.transform = `translate(calc(-50% + ${clientX * 0.02}px), ${clientY * 0.02}px)`;
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
   

      {/* Badge - Mobile Optimized */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.01] mb-8"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-white/50 font-cairo text-[10px] md:text-xs uppercase tracking-widest font-bold">
          نطور الأفكار لمشاريع واقعية
        </span>
      </motion.div>

      <div className="relative z-10">
        {/* Ghost Text - Desktop Only */}
        <motion.span 
          style={{ y: ghostY }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 text-[10rem] md:text-[16rem] font-black text-white/[0.01] pointer-events-none hidden lg:block tracking-tighter font-cairo leading-none"
        >
          إبداع
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-[8rem] font-black text-white leading-[1.1] md:leading-[0.9] tracking-tighter font-cairo"
        >
          نصنع <span className="text-white/20 italic font-extralight">واقعاً</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white/50">
            رقمياً مذهلاً.
          </span>
        </motion.h1>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mt-8 text-white/40 text-lg md:text-2xl font-cairo font-light leading-relaxed"
      >
        نحول التعقيد البرمجي إلى بساطة بصرية، نصمم 
        <span className="text-white mx-1.5 font-medium underline decoration-primary/30 underline-offset-8">أنظمة حية</span> 
        تتنفس ابتكاراً.
      </motion.p>
    </section>
  );
};