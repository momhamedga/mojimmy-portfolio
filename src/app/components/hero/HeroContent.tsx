"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";

export const HeroContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null); // Ref للإضاءة المحيطية
  
  const { scrollY } = useScroll();
  const ghostTextY = useTransform(scrollY, [0, 500], [0, -100]);

  // استخدام Spring عشان الحركة تكون أنعم (Fluid Motion)
  const springConfig = { stiffness: 100, damping: 30 };
  const smoothY = useSpring(ghostTextY, springConfig);

  // تأثير تتبع الماوس للإضاءة بدون Re-render
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      const { clientX, clientY } = e;
      // تحريك الإضاءة مباشرة عبر الـ DOM لسرعة خارقة
      glowRef.current.style.transform = `translate(calc(-50% + ${clientX * 0.05}px), ${clientY * 0.05}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative space-y-10 flex flex-col items-center select-none pt-12 text-center transform-gpu"
    >
      {/* 1. الإضاءة المحيطية - الآن تتحرك مع الماوس عبر الـ Ref */}
      <div 
        ref={glowRef}
        className="absolute -top-60 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[oklch(0.6_0.25_285/0.1)] blur-[160px] rounded-full pointer-events-none transition-transform duration-700 ease-out" 
      />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card group relative flex items-center gap-4 px-6 py-2.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-2xl transition-all"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500/40"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
        </span>
        <span className="text-white/60 font-cairo text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold group-hover:text-purple-400 transition-colors">
          نطور الأفكار لمشاريع واقعية
        </span>
      </motion.div>

      <div className="relative">
        <motion.span 
          style={{ y: smoothY }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 text-[15rem] font-black text-white/[0.02] whitespace-nowrap pointer-events-none hidden lg:block tracking-tighter font-cairo leading-none uppercase"
        >
          إبداع
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, filter: "blur(15px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="text-5xl md:text-[9rem] font-black text-white leading-[0.85] tracking-tighter font-cairo"
        >
          نصنع <span className="text-white/10 italic font-light">واقعاً</span> <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 py-6 bg-gradient-move">
            رقمياً مذهلاً.
          </span>
        </motion.h1>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="max-w-4xl text-white/50 text-xl md:text-3xl leading-relaxed px-8 font-cairo font-light"
      >
        نحن لا نبني مجرد مواقع، بل نصمم 
        <span className="text-white font-medium mx-2 relative inline-block group">
          أنظمة حية
          <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[1px] bg-purple-500 transition-all duration-700 shadow-[0_0_8px_oklch(0.65_0.25_285)] block" />
        </span>
        تتنفس ابتكاراً، نحول التعقيد البرمجي إلى بساطة بصرية.
      </motion.p>
    </div>
  );
};