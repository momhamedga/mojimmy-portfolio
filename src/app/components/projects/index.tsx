"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "@/src/constants/projects";

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  
  // 1. مراقبة السكرول بدقة عالية للأداء (GPU Focused)
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start end", "end start"] 
  });

  // 2. حركة النص الخلفي (Parallax) - محسنة للموبايل
  const rawTextX = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const textX = useSpring(rawTextX, { stiffness: 40, damping: 15 });

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      dir="rtl" 
      className="py-24 md:py-48 relative bg-transparent overflow-visible"
    >
      {/* النص العملاق (Ghost Text) - استخدام OKLCH لشفافية ذكية */}
      <motion.div 
        style={{ x: textX }} 
        className="absolute top-20 left-0 whitespace-nowrap opacity-[0.02] pointer-events-none select-none z-0 hidden lg:block overflow-hidden"
      >
        <span className="text-[22vw] font-black text-white uppercase tracking-tighter leading-none">
          PROJECTS • معرض الأعمال • PROJECTS •
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* الهيدر: Cinematic Reveal */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 md:mb-40"
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "3rem" }}
              className="h-[2px] bg-primary shadow-[0_0_10px_oklch(0.65_0.25_285)]" 
            />
            <span className="text-primary font-cairo text-xs md:text-sm tracking-[0.3em] font-bold uppercase">
              Featured Work 2026
            </span>
          </div>
          
          <h2 className="font-cairo text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.85]">
            مشاريع <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-blue-400 bg-gradient-move italic">
              مختارة.
            </span>
          </h2>
        </motion.div>

        {/* شبكة المشاريع: معالجة ذكية للموبايل */}
        <div className="flex flex-col gap-16 md:gap-32">
          {PROJECTS.map((project, index) => (
            <motion.div 
              key={project.id} 
              className="w-full relative group transform-gpu"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] 
              }}
            >
              {/* لمسة 2026: رقم المشروع يظهر في الخلفية عند الـ Hover */}
              <span className="absolute -top-10 -right-4 text-8xl md:text-[12rem] font-black text-white/[0.03] pointer-events-none group-hover:text-primary/5 transition-colors duration-500 font-inter">
                0{index + 1}
              </span>
              
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* تحسين الإضاءة السفلية (Ambient Backdrop) */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none -z-10 opacity-60" />
    </section>
  );
}