"use client"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useCallback, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

function ProjectCard({ project, index }: { project: any, index: number }) {
  const cardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // تحقق من حجم الشاشة لإيقاف الـ Tilt في الموبايل
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    requestAnimationFrame(() => {
      x.set(xPct);
      y.set(yPct);
    });
  }, [x, y, isMobile]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        opacity,
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity" 
      }}
      className={`${project.size} relative overflow-hidden group rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] transition-colors duration-500 min-h-[400px] md:min-h-full`}
    >
      {/* خلفية الصورة */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div style={{ y: isMobile ? 0 : translateY }} className="relative w-full h-[120%] -top-[10%]">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} mix-blend-overlay opacity-40 group-hover:opacity-20 transition-opacity duration-1000`} />
          <div className="absolute inset-0 flex items-center justify-center text-white/[0.03] font-black text-6xl md:text-8xl uppercase tracking-tighter select-none -rotate-6 group-hover:rotate-0 transition-transform duration-1000">
             {project.title.split(' ')[0]}
          </div>
        </motion.div>
      </div>

      {/* المحتوى */}
      <div className="relative z-10 h-full p-6 md:p-12 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <span className="text-purple-500 font-mono text-[10px] uppercase tracking-[0.5em] block">
              0{index + 1} // CASE_STUDY
            </span>
            <h3 className="text-3xl md:text-6xl font-black text-white tracking-tighter group-hover:translate-x-3 transition-transform duration-500 leading-none">
              {project.title}
            </h3>
            <p className={`text-gray-400 max-w-[280px] text-xs md:text-base leading-relaxed font-medium transition-all duration-700 
              ${isMobile ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"}`}>
               {project.description}
            </p>
          </div>
          
          <div className="p-3 md:p-4 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 text-white group-hover:bg-white group-hover:text-black transition-all duration-500 pointer-events-auto shadow-xl">
            <ArrowUpRight size={isMobile ? 20 : 28} />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
          {project.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1.5 md:px-5 md:py-2 bg-black/40 backdrop-blur-md rounded-full text-[9px] md:text-[10px] text-gray-300 border border-white/5 uppercase tracking-widest font-bold group-hover:border-purple-500/30">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xBg = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const projects = [
    { 
      title: "E-Commerce OS", 
      description: "نظام تجارة إلكترونية متكامل بأداء فائق وسرعة البرق.", 
      size: "md:col-span-2 md:row-span-2", 
      gradient: "from-blue-600 to-indigo-900",
      tags: ["Next.js 15", "Stripe", "Tailwind"],
    },
    { 
      title: "AI Studio", 
      description: "منصة إبداعية لتوليد الصور باستخدام الذكاء الاصطناعي.", 
      size: "col-span-1 row-span-1", 
      gradient: "from-purple-600 to-pink-600",
      tags: ["OpenAI", "React"],
    },
    { 
      title: "Fintech App", 
      description: "إدارة المحافظ المالية بأمان وذكاء.", 
      size: "col-span-1 row-span-1", 
      gradient: "from-cyan-500 to-blue-600",
      tags: ["Web3", "TypeScript"],
    },
    { 
      title: "Analytics Portal", 
      description: "تحويل البيانات المعقدة إلى رؤى بصرية بسيطة.", 
      size: "md:col-span-2 md:row-span-1", 
      gradient: "from-orange-500 to-red-600",
      tags: ["D3.js", "Firebase"],
    },
  ];

  return (
    <section ref={containerRef} id="projects" dir="rtl" className="py-16 md:py-32 relative overflow-hidden bg-transparent">
      {/* Background Decor - مخفي في الموبايل الصغير جداً لتحسين الأداء */}
      <motion.div style={{ x: xBg }} className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap pointer-events-none z-0 opacity-[0.03] select-none hidden md:block">
        <span className="text-[25vw] font-black text-white uppercase tracking-tighter">
          Work Showcase Work Showcase
        </span>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-16 md:mb-24 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
             <div className="h-px w-8 md:w-12 bg-purple-500" />
             <span className="text-purple-500 font-mono tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm uppercase">Selected Works</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="text-5xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.9] md:leading-[0.8]">
            مشاريع <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">متميزة</span>
          </motion.h2>
        </div>

        {/* تعديل الـ Grid للموبايل */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 md:auto-rows-[480px]">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}