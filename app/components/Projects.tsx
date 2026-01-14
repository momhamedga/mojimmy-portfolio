"use client"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

function ProjectCard({ project, index }: { project: any, index: number }) {
  const cardRef = useRef(null);
  
  // 1. حسابات الميلان (Tilt Effect) - مع تحسين استهلاك المعالج
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    
    requestAnimationFrame(() => {
      x.set(xPct);
      y.set(yPct);
    });
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  // 2. حسابات البارالاكس والظهور
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        opacity,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity" 
      }}
      className={`${project.size} project-card relative overflow-hidden group rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] transition-colors duration-500 cursor-none`}
    >
      {/* 3. خلفية الصورة المحسنة (LCP Optimization) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div style={{ y: translateY }} className="relative w-full h-[120%] -top-[10%]">
          <Image
            src={project.image || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop`} // رابط تجريبي
            alt={project.title}
            fill
            priority={index < 2} // تحميل فوري لأول مشروعين
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-30 group-hover:opacity-60 transition-all duration-1000 grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} mix-blend-overlay opacity-40 group-hover:opacity-20 transition-opacity duration-1000`} />
          
          {/* نص تيبوغرافي خلفي */}
          <div className="absolute inset-0 flex items-center justify-center text-white/[0.03] font-black text-8xl uppercase tracking-tighter select-none -rotate-6 group-hover:rotate-0 transition-transform duration-1000">
             {project.title.split(' ')[0]}
          </div>
        </motion.div>
      </div>

      {/* 4. محتوى الكارد العلوي */}
      <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-between translate-z-30 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <motion.span className="text-purple-500 font-mono text-[10px] uppercase tracking-[0.5em] block">
              0{index + 1} // CASE_STUDY
            </motion.span>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter group-hover:translate-x-3 transition-transform duration-500 leading-none">
              {project.title}
            </h3>
            <p className="text-gray-400 max-w-[280px] text-sm md:text-base leading-relaxed font-medium opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 delay-100">
               {project.description}
            </p>
          </div>
          
          <div className="p-4 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 text-white group-hover:bg-white group-hover:text-black transition-all duration-500 pointer-events-auto shadow-xl">
            <ArrowUpRight size={28} />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag: string) => (
            <span key={tag} className="px-5 py-2 bg-black/40 backdrop-blur-md rounded-full text-[10px] text-gray-300 border border-white/5 transition-all duration-500 uppercase tracking-widest font-bold group-hover:border-purple-500/30 group-hover:text-white">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* تأثير اللمعة السريع */}
      <div className="absolute inset-0 z-20 pointer-events-none group-hover:bg-gradient-to-tr from-transparent via-white/5 to-transparent transition-transform duration-1000 translate-x-[-150%] group-hover:translate-x-[150%]" />
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
      image: "/projects/shop.webp"
    },
    { 
      title: "AI Studio", 
      description: "منصة إبداعية لتوليد الصور باستخدام الذكاء الاصطناعي.", 
      size: "col-span-1 row-span-1", 
      gradient: "from-purple-600 to-pink-600",
      tags: ["OpenAI", "React"],
      image: "/projects/ai.webp"
    },
    { 
      title: "Fintech App", 
      description: "إدارة المحافظ المالية بأمان وذكاء.", 
      size: "col-span-1 row-span-1", 
      gradient: "from-cyan-500 to-blue-600",
      tags: ["Web3", "TypeScript"],
      image: "/projects/bank.webp"
    },
    { 
      title: "Analytics Portal", 
      description: "تحويل البيانات المعقدة إلى رؤى بصرية بسيطة.", 
      size: "md:col-span-2 md:row-span-1", 
      gradient: "from-orange-500 to-red-600",
      tags: ["D3.js", "Firebase"],
      image: "/projects/dash.webp"
    },
  ];

  return (
    <section ref={containerRef} id="projects" dir="rtl" className="py-32 relative overflow-hidden bg-transparent">
      {/* Background Text Decor */}
      <motion.div style={{ x: xBg }} className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap pointer-events-none z-0 opacity-[0.03] select-none">
        <span className="text-[25vw] font-black text-white uppercase tracking-tighter">
          Work Showcase Work Showcase
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-24 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
             <div className="h-px w-12 bg-purple-500" />
             <span className="text-purple-500 font-mono tracking-[0.3em] text-sm uppercase">Selected Works</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} className="text-7xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.8]">
            مشاريع <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">متميزة</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-[480px]">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}