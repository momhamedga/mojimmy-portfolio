"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";

export const HeroActions = ({ onStartProject }: { onStartProject: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
      className="flex flex-col sm:flex-row items-center gap-6 mt-14 transform-gpu"
    >
      {/* 1. زرار الأكشن الرئيسي: نيون أبيض متوهج */}
      <button
        onClick={onStartProject}
        className="group relative px-12 py-5 rounded-2xl bg-white text-black font-black font-cairo overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_oklch(1_0_0_/_0.2)] hover:shadow-[0_0_50px_oklch(1_0_0_/_0.4)]"
      >
        <span className="relative z-10 flex items-center gap-3 text-lg">
          ابدأ رحلتك الإبداعية
          <ArrowUpRight size={22} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
        
        {/* تأثير المسح الضوئي (Shiny Sweep) */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </button>
      
      {/* 2. زرار مشاهدة الأعمال: Glassmorphism مطور */}
      <Link href="#projects" className="w-full sm:w-auto">
        <button className="relative w-full px-12 py-5 rounded-2xl border border-white/5 text-white font-cairo font-bold backdrop-blur-2xl bg-white/[0.03] hover:bg-white/[0.07] transition-all hover:border-primary/30 group overflow-hidden">
          <span className="relative z-10 flex items-center justify-center gap-3">
            <Code2 size={20} className="text-primary/70 group-hover:text-primary transition-colors" />
            استكشف المختبر
          </span>
          
          {/* خلفية نيون خافتة تظهر عند الـ Hover */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
        </button>
      </Link>

      {/* لمسة 2026: تلميح بصري (Scroll Hint) لو الزائر فضل واقف */}
      <motion.div 
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -bottom-24 hidden lg:block opacity-20"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </motion.div>
  );
};