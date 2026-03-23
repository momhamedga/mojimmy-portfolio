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
      // ✅ التعديل 1: شيلنا الـ z-index خالص وخلينا الخلفية شفافة تماماً
      className="py-24 md:py-40 relative bg-transparent"
    >
      {/* النص العملاق الخلفي - قللنا الشفافية جداً */}
      <motion.div 
        style={{ x: textX }} 
        className="absolute top-1/4 left-0 whitespace-nowrap opacity-[0.01] pointer-events-none select-none z-0 hidden lg:block"
      >
        <span className="text-[20vw] font-black text-white uppercase tracking-tighter">
          PROJECTS • معرض الأعمال • PROJECTS •
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 bg-transparent">
        
        {/* الهيدر */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} // عشان ميفضلش يعمل ريندر كل شوية
          className="mb-20 md:mb-32 bg-transparent"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-purple-500" />
            <span className="text-purple-500 font-cairo text-xs tracking-widest uppercase">Featured Work</span>
          </div>
          <h2 className="font-cairo text-5xl md:text-8xl font-bold text-white tracking-tighter leading-none">
            مشاريع <br/> <span className="text-purple-500 italic">مختارة.</span>
          </h2>
        </motion.div>

        {/* شبكة المشاريع */}
        <div className="flex flex-col gap-10 md:gap-20 bg-transparent">
          {PROJECTS.map((project, index) => (
            <motion.div 
              key={project.id} 
              // ✅ التعديل 2: جعل الـ Wrapper شفاف تماماً وبدون overflow
              className="w-full relative font-cairo bg-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ✅ التعديل 3: الإضاءة دي كانت عاملة "ضباب" حاجب الـ Canvas، قللناها جداً */}
      <div className="absolute inset-0 bg-transparent pointer-events-none -z-10" />
    </section>
  );
}