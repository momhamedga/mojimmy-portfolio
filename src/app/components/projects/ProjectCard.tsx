"use client";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useState } from "react";
import { ArrowUpLeft } from "lucide-react";
import { Project } from "@/src/types/project";
import Link from "next/link";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isActive, setIsActive] = useState(false);

  // 1. استلام اللون المخصص أو استخدام لون افتراضي
  const themeColor = project.color || 'oklch(0.65 0.25 285)'; 
  
  // 2. أنيميشن تفاعلي (نفس المنطق بتاعك المطور)
  const mouseX = useMotionValue(0);
  const xOffset = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), { stiffness: 300, damping: 30 });

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - (rect.left + rect.width / 2));
      }}
      // حقن اللون في Variable محلية للكارد ده بس
      style={{ "--accent-color": themeColor } as any}
      className="relative w-full border-b border-white/5 group cursor-pointer overflow-hidden transition-all duration-500 bg-transparent"
    >
      {/* خلفية زجاجية ملونة (Dynamic Tint) */}
      <div 
        className={`absolute inset-0 transition-all duration-700 pointer-events-none ${
          isActive ? 'bg-[var(--accent-color)] opacity-[0.03] backdrop-blur-md' : 'bg-transparent'
        }`} 
      />

      {/* شعاع ليزر جانبي ملون */}
      <motion.div 
        animate={{ 
          opacity: isActive ? 1 : 0, 
          height: isActive ? "100%" : "0%",
        }}
        style={{ backgroundColor: "var(--accent-color)" }}
        className="absolute right-0 top-0 w-[2px] blur-[1px] z-30 shadow-[0_0_20px_var(--accent-color)]"
      />

      <div className="relative z-10 px-6 py-12 md:py-28">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            
            <div className="flex items-start gap-8 md:gap-16">
              {/* رقم المشروع */}
              <span className="font-mono text-sm text-white/10 mt-5 group-hover:text-[var(--accent-color)] transition-colors duration-500">
                {project.id}
              </span>

              <div className="flex flex-col gap-8">
                {/* العنوان اللي بيتأثر بلون المشروع عند الـ Hover */}
                <motion.h3 
                  style={{ x: xOffset }}
                  className="text-5xl md:text-[9rem] font-black font-cairo text-white/90 group-hover:text-white transition-all duration-700 tracking-tighter leading-[0.8]"
                >
                  <span className="group-hover:text-[var(--accent-color)] transition-colors duration-500">
                    {project.title.split(' ')[0]}
                  </span>
                  <br />
                  {project.title.split(' ').slice(1).join(' ')}
                </motion.h3>
                
                {/* Tags ملونة */}
                <div className="flex flex-wrap gap-3">
                  {project.tags?.map(tag => (
                    <span key={tag} className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/20 border border-white/5 px-4 py-2 rounded-full group-hover:border-[var(--accent-color)]/30 group-hover:text-[var(--accent-color)] transition-all duration-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* الوصف السينمائي الجانبي */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="hidden xl:block max-w-sm"
                >
                  <p className="text-xl text-white/40 leading-relaxed font-cairo font-light pr-8 border-r-2 border-[var(--accent-color)]/20 italic">
                    {project.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* زرار المعاينة المتلون */}
            <Link href={project.link} target="_blank" className="relative self-center lg:self-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex h-24 w-24 md:h-44 md:w-44 items-center justify-center rounded-[2.5rem] border border-white/10 group-hover:border-[var(--accent-color)]/50 transition-all duration-700 overflow-hidden"
              >
                <ArrowUpLeft className="w-10 h-10 md:w-20 md:h-20 text-white group-hover:text-[var(--accent-color)] transition-all duration-500 group-hover:-translate-y-2 group-hover:translate-x-2" />
                <div className="absolute inset-0 bg-[var(--accent-color)] opacity-0 group-hover:opacity-[0.03] blur-3xl transition-opacity" />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* ليزر المسح السفلي الملون */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent z-20"
        initial={{ width: 0 }}
        animate={{ width: isActive ? "100%" : "0%" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ boxShadow: isActive ? `0 0 20px var(--accent-color)` : 'none' }}
      />
    </motion.div>
  );
}