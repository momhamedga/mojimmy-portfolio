"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useMemo } from "react";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "@/src/constants/projects";

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  
  // 1. مراقبة السكرول بدقة
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start end", "end start"] 
  });

  // 2. حركة النص الخلفي بنعومة (Spring)
  const rawTextX = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const textX = useSpring(rawTextX, { stiffness: 50, damping: 20 });

  // 3. حركة الـ Opacity للهيدر عند الاقتراب
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      dir="rtl" 
      className="py-32 md:py-60 relative bg-transparent overflow-hidden"
    >
      
      {/* --- النص العملاق (Backdrop Text) --- */}
      <motion.div 
        style={{ x: textX }} 
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap opacity-[0.015] pointer-events-none select-none z-0 hidden lg:block will-change-transform"
      >
        <span className="text-[22vw] font-black text-white uppercase tracking-tighter leading-none">
          معرض الأعمال المميزة • FEATURED PROJECTS • 
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- الهيدر الاحترافي --- */}
        <motion.div 
          style={{ opacity: headerOpacity, y: headerY }}
          className="mb-24 md:mb-40 space-y-8"
        >
          <div className="flex items-center gap-4 group">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              className="h-[1px] bg-purple-500" 
            />
            <span className="text-purple-500 font-mono text-sm tracking-[0.4em] uppercase">
              التميز في التنفيذ
            </span>
          </div>
          
          <h2 className="text-7xl md:text-[11rem] font-black text-white leading-[0.75] tracking-tighter italic">
            رؤية <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-2xl">
              مبتكرة.
            </span>
          </h2>
        </motion.div>

        {/* --- شبكة المشاريع (Dynamic Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-16">
          {PROJECTS.map((project, index) => {
            // توزيع المساحات (Column Span) بشكل غير منتظم للفخامة
            const isWide = index % 3 === 0;
            const colSpan = isWide ? "lg:col-span-7" : "lg:col-span-5";
            const marginTop = index % 2 !== 0 ? "lg:mt-32" : "lg:mt-0";

            return (
              <motion.div 
                key={project.id} 
                className={`${colSpan} ${marginTop} relative`}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
              >
                {/* Parallax Effect داخلي للكروت */}
                <ProjectCard project={project} index={index} />
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* تأثير إضاءة خلفي للسكشن */}
      <div className="absolute top-1/2 left-0 w-full h-full bg-radial-gradient from-purple-500/5 to-transparent -z-10 blur-3xl pointer-events-none" />
    </section>
  );
}