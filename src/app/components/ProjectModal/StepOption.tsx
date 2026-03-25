"use client"
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface OptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const StepOption = ({ label, selected, onClick }: OptionProps) => {
  // استخدام Ref لمنع الـ Double Click السريع اللي ممكن يبوظ الـ Multi-step logic
  const isProcessing = useRef(false);

  const handleSafeClick = () => {
    if (isProcessing.current) return;

    isProcessing.current = true;
    onClick();

    // إعادة التفعيل بعد فترة بسيطة جداً لضمان الانتقال السلس للخطوة التالية
    setTimeout(() => {
      isProcessing.current = false;
    }, 400);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }} // تقليل الـ scale سنة بسيطة لإحساس الضغط الواقعي
      onClick={handleSafeClick}
      className={`w-full text-right p-6 rounded-[1.5rem] border transition-all duration-500 group relative overflow-hidden
        ${selected 
          ? "border-purple-500/50 bg-purple-500/10 text-white shadow-[0_0_25px_rgba(168,85,247,0.1)]" 
          : "border-white/5 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:bg-white/[0.06]"}`}
    >
      {/* 1. الطبقة الخلفية للتوهج عند الاختيار */}
      {selected && (
        <motion.div 
          layoutId="option-glow"
          className="absolute inset-0 bg-purple-500/5 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <div className="flex items-center justify-between relative z-10">
        {/* 2. مؤشر الحالة (Dot) */}
        <div className="relative">
           <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 
             ${selected ? "bg-purple-500 scale-125" : "bg-white/10"}`} 
           />
           {selected && (
             <motion.div 
               layoutId="dot-pulse"
               className="absolute inset-0 bg-purple-400 rounded-full blur-[4px]"
               animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
             />
           )}
        </div>

        <span className="font-cairo font-bold text-lg tracking-tight">{label}</span>
      </div>

      {/* 3. تأثير اللمعة السينمائي (Glossy Shine) */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -skew-x-20"
            initial={{ x: "-150%" }}
            animate={{ x: "150%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};