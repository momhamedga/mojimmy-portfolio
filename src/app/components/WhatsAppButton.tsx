"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useMagneticPointer } from "../hooks/useMagneticPointer";

/**
 * زر الواتساب العائم (ديسكتوب فقط).
 *
 * تحسين Phase 3: اتشال useState(isHovered) بالكامل — كل حالات الـ hover
 * (التلميح، التوهّج، تكبير الزر) بقت CSS عبر group-hover. الـ JS الباقي
 * هو تأثير المغناطيسية بس، وهو مبني على refs + rAF بدون أي state.
 */
export default function WhatsAppButton() {
  const { ref, x, y, handleMouseMove, reset } = useMagneticPointer(0.2, {
    stiffness: 60,
    damping: 15,
  });

  return (
    <div className="fixed bottom-8 left-8 z-1000 hidden md:block group">
      {/* 1. التلميح (Tooltip) — فوق الزرار مباشرة */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-0 translate-y-2.5 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-[70px] group-hover:scale-100"
      >
        <div className="glass-light px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-foreground text-xs font-cairo font-medium whitespace-nowrap">
            تواصل معي
          </span>
        </div>
        {/* سهم صغير أسفل الـ Tooltip */}
        <div className="w-2 h-2 bg-surface backdrop-blur-md border-r border-b border-border rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
      </div>

      {/* 2. حاوية الزرار */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={reset}
        style={{ x, y }}
        className="relative w-20 h-20 flex items-center justify-center cursor-pointer"
      >
        {/* خلفية متوهجة (Soft Glow) */}
        <div className="absolute inset-4 bg-[#25D366] rounded-full blur-[30px] opacity-10 scale-100 transition-all duration-700 group-hover:opacity-20 group-hover:scale-150" />

        {/* الزر الدائري الفخم */}
        <a
          href="https://wa.me/+971589915968"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل معي عبر واتساب"
          className="relative z-10 w-14 h-14 bg-linear-to-tr from-[#128C7E] to-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.3)] border border-white/10 transition-transform duration-300 hover:scale-110 active:scale-90"
        >
          {/* انعكاس ضوئي (Glossy Look) */}
          <div className="absolute inset-0 bg-linear-to-b from-white/20 to-transparent rounded-full pointer-events-none" />

          <MessageCircle aria-hidden="true" className="text-white w-7 h-7 fill-white/10" />
        </a>
      </motion.div>
    </div>
  );
}
