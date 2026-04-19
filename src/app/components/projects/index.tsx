"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "@/src/constants/projects";

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start end", "end start"] 
  });

  const rawTextX = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const textX = useSpring(rawTextX, { stiffness: 40, damping: 15 });

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      dir="rtl" 
      className="py-16 md:py-48 relative bg-transparent overflow-hidden"
    >
      {/* Ghost Text - Desktop Only */}
      <motion.div 
        style={{ x: textX }} 
        className="absolute top-20 left-0 whitespace-nowrap opacity-[0.015] pointer-events-none select-none z-0 hidden lg:block"
      >
        <span className="text-[20vw] font-black text-white uppercase tracking-tighter leading-none font-inter">
          PROJECTS • معرض الأعمال • PROJECTS •
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-40"
        >
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="h-[1px] w-8 md:w-12 bg-primary shadow-[0_0_10px_oklch(0.65_0.25_285)]" />
            <span className="text-primary font-cairo text-[10px] md:text-sm tracking-[0.3em] font-bold uppercase">
              Featured Work 2026
            </span>
          </div>
          
          <h2 className="font-cairo text-5xl md:text-[9rem] font-black text-white tracking-tighter leading-[1] md:leading-[0.85]">
            مشاريع <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-blue-400 italic">
              مختارة.
            </span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-10 md:gap-32">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}