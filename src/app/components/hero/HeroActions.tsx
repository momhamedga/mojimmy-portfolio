"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

export const HeroActions = ({ onStartProject }: { onStartProject: () => void }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
  };

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.8 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9 w-full transform-gpu"
    >
      <button
        ref={btnRef}
        onMouseMove={handleMouseMove}
        onClick={onStartProject}
        className="group relative px-8 py-3.5 rounded-2xl bg-primary text-white font-black font-cairo overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
      >
        <span className="relative z-10 flex items-center gap-3 text-sm md:text-base tracking-wide">
          ابدأ رحلتك الإبداعية
          <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>

        {/* تأثير الـ Spot-light النيون */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "radial-gradient(circle at var(--x) var(--y), color-mix(in oklch, white 30%, transparent) 0%, transparent 50%)",
          }}
        />
      </button>

      <button
        onClick={scrollToProjects}
        className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl text-foreground-dim hover:text-foreground font-bold font-cairo text-sm md:text-base transition-colors cursor-pointer"
      >
        شاهد أعمالي
        <ChevronDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
      </button>
    </motion.div>
  );
};
