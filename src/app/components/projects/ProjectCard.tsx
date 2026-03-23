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
    if (colorValue.startsWith('[')) return colorValue.slice(1, -1);
    if (colorValue.startsWith('rgba')) return colorValue;
    return `var(--color-${colorValue})`;
  }, [project.gradient]);

  // --- إبداع الموبايل: تأثير الانضغاط عند اللمس ---
  const tapScale = useMotionValue(1);
  const springScale = useSpring(tapScale, { stiffness: 300, damping: 20 });

  const handleTouchStart = () => tapScale.set(0.97); // انكماش خفيف جداً يحسسك إنك بتضغط زرار حقيقي
  const handleTouchEnd = () => {
    tapScale.set(1);
    setIsActive(!isActive);
  };

  return (
    <motion.div
      layout
      style={{ 
        "--project-color": projectColor,
        scale: springScale, // تطبيق تأثير الضغطة
        WebkitTapHighlightColor: "transparent" 
      } as any}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className="relative project-card w-full border-b border-white/5 group cursor-pointer select-none touch-manipulation overflow-hidden"
      dir="rtl"
    >
      {/* تأثير "اللمعان" للموبايل عند التفعيل */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "linear" }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 px-6 py-10 md:py-24 transition-all duration-700">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
            
            <div className="flex items-start gap-5 md:gap-12">
              <span className="font-mono text-[10px] md:text-sm text-white/20 mt-2 group-hover:text-[(--project-color)] transition-colors duration-500">
                {project.id.toString().padStart(2, '0')}
              </span>

              <div className="flex flex-col gap-3">
                <h3 className="text-3xl md:text-8xl font-bold text-white/90 group-hover:text-[(--project-color)] transition-all duration-700 group-hover:italic tracking-tighter sm:group-hover:-translate-x-4">
                  {project.title}
                </h3>
                
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {project.tags?.map(tag => (
                    <span key={tag} className="text-[9px] md:text-[11px] uppercase tracking-tighter md:tracking-widest text-white/30 border border-white/10 px-2 py-0.5 rounded-full group-hover:border-[(--project-color)]/30 group-hover:text-[(--project-color)] transition-all duration-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* الوصف: حركة "الانسدال" للموبايل */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="overflow-hidden md:max-w-md block"
                >
                  <p className="text-sm md:text-lg text-white/60 leading-relaxed font-light py-2 md:py-4 pr-4 border-r-2 border-[(--project-color)]/20 italic">
                    {project.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between md:block">
               {/* مؤشر بصري للموبايل */}
               <motion.div 
                animate={{ rotate: isActive ? -90 : 0, scale: isActive ? 1.2 : 1 }}
                className="md:hidden text-white/20"
               >
                 <ChevronLeft size={20} style={{ color: isActive ? projectColor : '' }} />
               </motion.div>
<Link          href={project.link}    target="_blank">
              <motion.button
       
             
                onClick={(e) => e.stopPropagation()}
                whileTap={{ scale: 0.8 }}
                className="relative flex h-14 w-14 md:h-24 md:w-24 items-center justify-center rounded-full border border-white/10 group-hover:border-[(--project-color)] overflow-hidden shadow-2xl transition-colors duration-500"
              >
                <motion.div 
                  animate={{ opacity: isActive ? 0.15 : 0 }}
                  className="absolute inset-0 bg-[(--project-color)]"
                />
                
                <ArrowUpLeft 
                  className="relative z-10 transition-colors duration-500 w-6 h-6 md:w-10 md:h-10" 
                  style={{ color: isActive ? projectColor : 'white' }}
                />

                <motion.div 
                  animate={{ scale: isActive ? 1.1 : 1, opacity: isActive ? 0.3 : 0 }}
                  className="absolute inset-0 border border-[(--project-color)] rounded-full blur-xs"
                />
                </motion.button>
                </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Glow خلفي للموبايل - تم تقليله لراحة العين */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div 
              className="absolute right-0 top-0 h-full w-full opacity-[0.07] blur-[100px]"
              style={{ background: `radial-gradient(circle at 80% 50%, ${projectColor}, transparent)` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="absolute bottom-0 left-0 h-px bg-[(--project-color)] z-20"
        style={{ boxShadow: `0 0 15px ${projectColor}` }}
        initial={{ width: 0 }}
        animate={{ width: isActive ? "100%" : "0%" }}
        transition={{ duration: 0.8, ease: "circOut" }}
      />
    </motion.div>
  );
}