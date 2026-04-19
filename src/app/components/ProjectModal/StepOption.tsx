"use client"
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface OptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const StepOption = ({ label, selected, onClick }: OptionProps) => {
  const isProcessing = useRef(false);

  const handleSafeClick = () => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    onClick();
    setTimeout(() => {
      isProcessing.current = false;
    }, 400);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={handleSafeClick}
      // إزالة الكلاسات الملونة الثابتة واستبدالها بمتغيرات CSS
      className={`w-full text-right p-6 rounded-[1.8rem] border transition-all duration-700 group relative overflow-hidden
        ${selected 
          ? "text-white shadow-2xl" 
          : "border-white/5 bg-white/[0.02] text-white/30 hover:border-white/10 hover:bg-white/[0.04]"}`}
      style={{ 
        borderColor: selected ? "var(--color-primary)" : "",
        backgroundColor: selected ? "rgba(255, 255, 255, 0.03)" : "" 
      }}
    >
      {/* 1. التوهج الخلفي (Adaptive Glow) */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            layoutId="option-glow"
            className="absolute inset-0 blur-2xl opacity-10 transition-colors duration-[2000ms]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: "var(--color-primary)" }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between relative z-10">
        {/* 2. مؤشر الحالة (Interactive Dot) */}
        <div className="relative">
           <div 
             className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${selected ? "scale-125 shadow-[0_0_12px_var(--color-primary)]" : "bg-white/10"}`} 
             style={{ backgroundColor: selected ? "var(--color-primary)" : "" }}
           />
           {selected && (
             <motion.div 
               layoutId="dot-pulse"
               className="absolute inset-0 rounded-full blur-[4px] transition-colors duration-[2000ms]"
               style={{ backgroundColor: "var(--color-primary)" }}
               animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
           )}
        </div>

        <span className={`font-cairo font-bold text-[16px] tracking-tight transition-all duration-500 ${selected ? "translate-x-1" : "group-hover:text-white/60"}`}>
          {label}
        </span>
      </div>

      {/* 3. تأثير اللمعة السينمائي (Adaptive Gloss) */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-20"
            initial={{ x: "-150%" }}
            animate={{ x: "150%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* 4. تأثير الحدود المضيئة عند الـ Hover (اختياري لكنه فخم جداً) */}
      {!selected && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}
    </motion.button>
  );
};