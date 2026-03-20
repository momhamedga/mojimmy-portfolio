"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "@/src/constants/projects";

export default function Projects() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  
  // حركة النص العملاق في الخلفية
  const textX = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section ref={containerRef} id="projects" dir="rtl" className="py-24 md:py-40 relative bg-transparent overflow-hidden">
      
      {/* نص السكرول العملاق (خلفية) */}
      <motion.div style={{ x: textX }} className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap opacity-[0.02] pointer-events-none select-none z-0 hidden lg:block">
        <span className="text-[20vw] font-black text-white uppercase tracking-tighter">
          معرض الأعمال المميزة معرض الأعمال المميزة
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        {/* الهيدر */}
        <div className="mb-20 md:mb-32 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-purple-500" />
            <span className="text-purple-500 font-mono text-sm tracking-[0.3em] uppercase">أبرز ما أنجزت</span>
          </div>
          
          <h2 className="text-6xl md:text-[9rem] font-black text-white leading-[0.8] tracking-tighter">
            مشاريع <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">متميزة.</span>
          </h2>
        </div>

        {/* شبكة المشاريع (Grid) */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:auto-rows-[450px]">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}