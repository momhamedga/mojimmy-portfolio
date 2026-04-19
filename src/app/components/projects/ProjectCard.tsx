"use client";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { ArrowUpLeft } from "lucide-react";
import { Project } from "@/src/types/project";
import Link from "next/link";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const themeColor = project.color || 'oklch(0.65 0.25 285)'; 
  
  const mouseX = useMotionValue(0);
  const xOffset = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), { 
    stiffness: 300, damping: 30 
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
  }, [mouseX]);

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => { setIsActive(false); mouseX.set(0); }}
      onMouseMove={handleMouseMove}
      className="relative w-full border-b border-white/5 group cursor-pointer overflow-hidden transition-all duration-500 bg-transparent"
    >
      {/* Background Glow - Desktop Only */}
      <div className={`absolute inset-0 transition-all duration-700 pointer-events-none hidden lg:block ${
          isActive ? 'bg-[oklch(0.65_0.25_285/0.03)] backdrop-blur-md' : 'bg-transparent'
        }`} 
      />

      <div className="relative z-10 px-4 py-10 md:py-28">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-12">
          
          <div className="flex items-start gap-6 md:gap-16">
            <span className="font-mono text-xs md:text-sm text-white/10 mt-2 md:mt-5 group-hover:text-primary transition-colors font-inter">
              {project.id.toString().padStart(2, '0')}
            </span>

            <div className="flex flex-col gap-6 md:gap-8">
              <motion.h3 
                style={{ x: xOffset }}
                className="text-4xl md:text-[8rem] font-black font-cairo text-white/90 group-hover:text-white transition-all duration-700 tracking-tighter leading-[1] md:leading-[0.8]"
              >
                <span className="group-hover:text-primary transition-colors">
                  {project.title.split(' ')[0]}
                </span>
                <br />
                {project.title.split(' ').slice(1).join(' ')}
              </motion.h3>
              
              {/* Mobile Description - يظهر دائما في الموبايل */}
              <p className="block lg:hidden text-sm md:text-lg text-white/40 leading-relaxed font-cairo font-light max-w-md">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 md:gap-3">
                {project.tags?.map(tag => (
                  <span key={tag} className="text-[8px] md:text-xs font-bold uppercase tracking-widest text-white/20 border border-white/5 px-3 py-1.5 rounded-full group-hover:border-primary/30 group-hover:text-primary transition-all">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Description */}
          <AnimatePresence>
            {isActive && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hidden xl:block max-w-sm"
              >
                <p className="text-xl text-white/40 leading-relaxed font-cairo font-light pr-8 border-r-2 border-primary/20 italic">
                  {project.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button - Optimized for Touch */}
          <Link href={project.link || "#"} target="_blank" className="relative self-end lg:self-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex h-16 w-16 md:h-40 md:w-40 items-center justify-center rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 group-hover:border-primary/50 transition-all duration-700"
            >
              <ArrowUpLeft className="w-6 h-6 md:w-16 md:h-16 text-white group-hover:text-primary transition-all group-hover:-translate-y-1 group-hover:translate-x-1" />
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Laser Bottom - Optimized Animation */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent z-20"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut" }}
      />
    </motion.div>
  );
}