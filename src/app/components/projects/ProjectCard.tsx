"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowUpLeft, Sparkles } from "lucide-react";
import { Project } from "@/src/types/project";

export function ProjectCard({ project, index }: { project: Project, index: number }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      // التفاعل مع الموبايل (Touch) والكمبيوتر (Hover)
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      className="relative w-full border-b border-white/5 py-8 md:py-16 group transition-colors duration-500 overflow-hidden"
      dir="rtl"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* الجانب الأيمن: الترقيم والعنوان */}
          <div className="flex items-center gap-6 md:gap-10">
            <span className="font-mono text-sm text-purple-500/40">0{index + 1}</span>
            <div className="space-y-3">
              <h3 className="text-3xl md:text-7xl font-bold text-white/90 group-hover:text-white transition-all duration-500 group-hover:italic">
                {project.title}
              </h3>
              <div className="flex gap-2">
                {project.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-tighter text-white/30 border border-white/10 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* الجانب الأوسط: الوصف (ظهور انسيابي بدون Lag) */}
          <motion.div 
            animate={{ 
              opacity: isActive ? 1 : 0, 
              x: isActive ? 0 : 20 
            }}
            className="max-w-xs hidden md:block"
          >
            <p className="text-sm text-white/50 leading-relaxed italic">
              {project.description}
            </p>
          </motion.div>

          {/* الجانب الأيسر: زر الإجراء */}
          <motion.a
            href={project.link}
            whileTap={{ scale: 0.9 }}
            className="relative flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-full border border-white/10 overflow-hidden group/btn"
          >
            <motion.div 
              animate={{ y: isActive ? 0 : "100%" }}
              className="absolute inset-0 bg-white transition-all duration-500"
            />
            <ArrowUpLeft className="relative z-10 text-white group-hover/btn:text-black transition-colors duration-500 w-6 h-6 md:w-8 md:h-8" />
          </motion.a>
        </div>
      </div>

      {/* --- خلفية الصورة (The Reveal Layer) --- */}
      {/* هذا الجزء مصمم ليكون خفيف جداً على المعالج */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: "10%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-10%" }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          >
            {/* تأثير ضوئي خلفي بدلاً من صورة ثقيلة */}
            <div className={`absolute left-0 top-0 h-full w-full md:w-2/3 bg-gradient-to-l from-transparent via-${project.gradient.split('-')[2]}/5 to-transparent opacity-30`} />
            
            {/* نص المشروع العملاق خلف الكلام */}
            <span className="absolute -left-10 top-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.02] select-none tracking-tighter italic">
              {project.id}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* خط التفاعل السفلي (Progress Bar) */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-purple-500/50"
        initial={{ width: 0 }}
        animate={{ width: isActive ? "100%" : 0 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}