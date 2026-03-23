"use client"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useMemo } from "react";
import { ArrowUpLeft, ChevronLeft } from "lucide-react";
import { Project } from "@/src/types/project";
import Link from "next/link";

export function ProjectCard({ project, index }: { project: Project, index: number }) {
  const [isActive, setIsActive] = useState(false);

  const projectColor = useMemo(() => {
    const fromPart = project.gradient.split(' ').find(p => p.startsWith('from-')) || 'from-purple-500';
    const colorValue = fromPart.replace('from-', '');
    return colorValue.startsWith('[') ? colorValue.slice(1, -1) : `var(--color-${colorValue})`;
  }, [project.gradient]);

  const tapScale = useMotionValue(1);
  const springScale = useSpring(tapScale, { stiffness: 400, damping: 25 });

  return (
    <motion.div
      layout
      style={{ 
        "--project-color": projectColor,
        scale: springScale,
        WebkitTapHighlightColor: "transparent" 
      } as any}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={() => tapScale.set(0.98)}
      onTouchEnd={() => { tapScale.set(1); setIsActive(!isActive); }}
      // ✅ التعديل الجوهري: تأكد من عدم وجود أي bg-black مخفي
      className="relative w-full border-b border-white/5 group cursor-pointer select-none overflow-visible transition-all duration-500 bg-transparent"
      dir="rtl"
    >
      {/* 1. الطبقة الزجاجية - خليناها شفافة جداً (0.01) عشان الـ Canvas يبان */}
      <div 
        className={`absolute inset-0 transition-all duration-700 pointer-events-none ${
          isActive ? 'bg-white/[0.03] backdrop-blur-[2px]' : 'bg-transparent backdrop-blur-none'
        }`} 
      />

      {/* 2. اللمعان الجانبي النيون */}
      <motion.div 
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
        className="absolute right-0 top-0 w-[2px] h-full bg-[(--project-color)] blur-[1px] z-30"
      />

      {/* 3. المحتوى - لازم الـ Container كمان يكون شفاف */}
      <div className="relative z-10 px-6 py-12 md:py-28 bg-transparent">
        <div className="container mx-auto bg-transparent">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-transparent">
            
            <div className="flex items-start gap-6 md:gap-16">
              <span className="font-mono text-xs md:text-base text-white/10 mt-3 group-hover:text-[(--project-color)] transition-colors duration-500">
                {project.id.toString().padStart(2, '0')}
              </span>

              <div className="flex flex-col gap-4">
                <h3 className="text-4xl md:text-[9rem] font-[900] font-cairo text-white/90 group-hover:text-[(--project-color)] transition-all duration-700 tracking-tighter sm:group-hover:-translate-x-6 leading-none">
                  {project.title}
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map(tag => (
                    <span key={tag} className="text-[10px] md:text-[12px] font-almarai font-medium uppercase tracking-wider text-white/20 border border-white/5 px-3 py-1 rounded-full group-hover:border-[(--project-color)]/20 group-hover:text-[(--project-color)]/80 transition-all duration-500 bg-transparent">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden md:max-w-sm bg-transparent"
                >
                  <p className="text-sm md:text-xl text-white/50 leading-relaxed font-almarai font-light py-4 pr-6 border-r border-[(--project-color)]/30 italic">
                    {project.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between md:block bg-transparent">
               <motion.div animate={{ rotate: isActive ? -90 : 0 }} className="md:hidden text-white/10">
                 <ChevronLeft size={24} style={{ color: isActive ? projectColor : '' }} />
               </motion.div>

               <Link href={project.link} target="_blank" onClick={(e) => e.stopPropagation()}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative flex h-16 w-16 md:h-32 md:w-32 items-center justify-center rounded-full border border-white/10 group-hover:border-[(--project-color)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-700 bg-transparent"
                  >
                    <ArrowUpLeft 
                      className="relative z-10 w-8 h-8 md:w-14 md:h-14 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" 
                      style={{ color: isActive ? projectColor : 'white' }}
                    />
                    <div className="absolute inset-0 rounded-full bg-[(--project-color)] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  </motion.div>
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ليزر النهاية السفلي */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[(--project-color)] to-transparent z-20"
        initial={{ width: 0 }}
        animate={{ width: isActive ? "100%" : "0%" }}
        transition={{ duration: 0.8, ease: "circOut" }}
        style={{ boxShadow: `0 0 20px ${projectColor}` }}
      />
    </motion.div>
  );
}