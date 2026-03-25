"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Code2 } from "lucide-react";

export const HeroActions = ({ onStartProject }: { onStartProject: () => void }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // تحديث متغيرات الـ CSS مباشرة للأداء
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.8 }}
      className="flex flex-col sm:flex-row items-center gap-6 mt-14 transform-gpu"
    >
      <button
        ref={btnRef}
        onMouseMove={handleMouseMove}
        onClick={onStartProject}
        className="group relative px-12 py-5 rounded-2xl bg-white text-black font-black font-cairo overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
      >
        <span className="relative z-10 flex items-center gap-3 text-lg">
          ابدأ رحلتك الإبداعية
          <ArrowUpRight size={22} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
        
        {/* تأثير الـ Spot-light المعتمد على الـ Ref */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(168,85,247,0.15),transparent_40%)]" />
      </button>

   
    </motion.div>
  );
};