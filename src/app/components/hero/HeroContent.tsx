"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const HeroContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 2026 Parallax Logic: حركة خفيفة للعناصر مع السكرول لزيادة العمق
  const { scrollY } = useScroll();
  const ghostTextY = useTransform(scrollY, [0, 500], [0, -100]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div 
      ref={containerRef}
      className="relative space-y-10 flex flex-col items-center select-none pt-12 text-center transform-gpu"
    >
      {/* 1. الإضاءة المحيطية (Ambient 2026) - استخدام OKLCH لسطوع نقي */}
      <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[oklch(0.6_0.25_285/0.08)] blur-[160px] rounded-full pointer-events-none" />

      {/* 2. الـ Badge المتطور: استخدام Glassmorphism 2.0 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card group relative flex items-center gap-4 px-6 py-2.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-2xl transition-all hover:bg-white/[0.05]"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_15px_oklch(0.65_0.25_285)]"></span>
        </span>
        <span className="text-white/60 font-cairo text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold group-hover:text-primary transition-colors">
          نطور الأفكار لمشاريع واقعية
        </span>
      </motion.div>

      {/* 3. العنوان الرئيسي (The Visual Masterpiece) */}
      <div className="relative">
        {/* Ghost Text: استخدام الخط العريض جداً مع حركة Parallax */}
        <motion.span 
          style={{ y: ghostTextY }}
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
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-blue-400 py-6 bg-gradient-move neon-glow-primary">
            رقمياً مذهلاً.
          </span>
        </motion.h1>
      </div>

    {/* 4. النص السردي المعدل */}
<motion.p 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.8, duration: 1 }}
  className="max-w-4xl text-white/50 text-xl md:text-3xl leading-relaxed px-8 font-cairo font-light"
>
  نحن لا نبني مجرد مواقع، بل نصمم 
  <span className="text-white font-medium mx-2 relative inline-block">
    أنظمة حية
    {/* ✅ التعديل هنا: حولنا الـ div لـ span مع الحفاظ على الـ styling */}
    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary/50 shadow-[0_0_8px_oklch(0.65_0.25_285)] block" />
  </span>
  تتنفس ابتكاراً، نحول التعقيد البرمجي إلى بساطة بصرية تجسد مستقبل الويب.
</motion.p>

      {/* 5. شعاع طاقة (Laser Line) - يعطي إيحاء بمسح الصفحة (Scanning) */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.4, 0.1], 
          height: ["20px", "150px", "20px"],
          y: [0, 50, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-10 top-1/3 w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent blur-[2px] hidden md:block"
      />

      {/* زينة هندسية: حلقات نيون خافتة */}
      <div className="absolute -bottom-20 flex justify-center w-full pointer-events-none opacity-20">
         <div className="w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
      </div>
    </div>
  );
};