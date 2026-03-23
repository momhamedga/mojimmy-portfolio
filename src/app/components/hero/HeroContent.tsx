"use client";
import { motion } from "framer-motion";

export const HeroContent = () => {
  return (
    <div className="relative space-y-12 flex flex-col items-center select-none pt-10 text-center">
      
      {/* 1. النيون العلوي (Ambient Glow) - بنفسجي ملكي */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* 2. الـ Badge المتطور - عربي بالكامل */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25 }}
        className="group relative inline-flex items-center gap-3 px-6 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.03] backdrop-blur-3xl"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500 shadow-[0_0_12px_#a855f7]"></span>
        </span>
        <span className="text-purple-100/70 font-cairo text-[11px] uppercase tracking-[0.2em] font-bold group-hover:text-white transition-colors">
        نطور الافكار لمشاريع واقعية
        </span>
        {/* خط نيون رفيع بيلمع تحت الـ Badge */}
        <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      </motion.div>

      {/* 3. العنوان الرئيسي (The Masterpiece) */}
      <div className="relative">
        {/* Ghost Text خلفية - كلمة "إبداع" بالعربي */}
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 text-[12rem] font-[900] text-purple-500 whitespace-nowrap pointer-events-none hidden md:block tracking-tighter font-cairo"
        >
          إبداع
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-[8rem] font-[900] text-white leading-[1] tracking-tight font-cairo"
        >
          نصنع <span className="text-white/10 italic ">واقعاً</span> <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-400 py-4 bg-gradient-move">
            رقمياً مذهلاً.
            {/* توهج سفلي نيون أزرق/بنفسجي */}
            <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-md" />
          </span>
        </motion.h1>
      </div>

      {/* 4. النص الفرعي (The Storyteller) - بخط Almarai المريح */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-3xl text-gray-400 text-lg md:text-2xl leading-[1.8] px-6 font-cairo font-light"
      >
        <span className="text-white font-medium border-b border-purple-500/30">نحول التعقيد إلى بساطة.</span> متخصصون في بناء تجارب رقمية تتنفس ابتكاراً وتترك أثراً بصرياً يجسد مستقبل الويب في المنطقة.
      </motion.p>

      {/* 5. شعاع طاقة جانبي (Decorative Beam) */}
      <motion.div 
        animate={{ opacity: [0.2, 0.5, 0.2], y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -right-20 top-1/4 w-[2px] h-32 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent blur-[1px]"
      />
    </div>
  );
};