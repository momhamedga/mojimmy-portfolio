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
  const textX = useSpring(rawTextX, { stiffness: 50, damping: 20 });

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      dir="rtl" 
      className="py-24 md:py-40 relative bg-transparent overflow-hidden"
    >
      {/* النص العملاق الخلفي - قللنا الشفافية جداً عشان ميزحمش العين */}
      <motion.div 
        style={{ x: textX }} 
        className="absolute top-1/4 left-0 whitespace-nowrap opacity-[0.01] pointer-events-none select-none z-0 hidden lg:block"
      >
        <span className="text-[20vw] font-black text-white uppercase tracking-tighter">
          PROJECTS • معرض الأعمال • PROJECTS •
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* الهيدر - جعلناه أبسط وأقوى */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20 md:mb-32"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-purple-500" />
            <span className="text-purple-500 font-mono text-xs tracking-widest uppercase">Featured Work</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-none">
            مشاريع <br/> <span className="text-purple-500 italic">مختارة.</span>
          </h2>
        </motion.div>

        {/* شبكة المشاريع - التعديل هنا لعدم التداخل */}
        <div className="flex flex-col gap-10 md:gap-20">
          {PROJECTS.map((project, index) => (
            <motion.div 
              key={project.id} 
              className="w-full relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* استدعاء الكارت المعدل اللي ظبطناه سوا */}
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* إضاءة خلفية ناعمة جداً */}
      <div className="absolute -bottom-20 left-0 w-full h-96 bg-purple-600/5 blur-[120px] -z-10" />
    </section>
  );
}