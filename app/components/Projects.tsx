"use client"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

function ProjectCard({ project, index }: { project: any, index: number }) {
  const cardRef = useRef(null);
  
  // 1. حسابات الميلان (Tilt Effect)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // 2. حسابات السكرول والبارالاكس
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
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
        transformStyle: "preserve-3d" 
      }}
      // أضفنا كلاس project-card ليتفاعل معه الماوس المطور
      className={`${project.size} project-card relative overflow-hidden group rounded-[3rem] border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-colors duration-700 cursor-none`}
    >
      {/* 3. تأثير اللمعة (Shine Effect) */}
      <div className="absolute inset-0 z-0 pointer-events-none group-hover:bg-gradient-to-tr from-transparent via-white/5 to-transparent transition-transform duration-1000 translate-x-[-100%] group-hover:translate-x-[100%]" />

      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div style={{ y: translateY }} className="relative w-full h-[120%] -top-[10%]">
          <div className={`w-full h-full bg-gradient-to-br ${project.gradient} opacity-[0.03] group-hover:opacity-[0.15] transition-all duration-1000 scale-110 group-hover:scale-125`} />
          
          <div className="absolute inset-0 flex items-center justify-center text-white/[0.02] font-black text-9xl uppercase tracking-tighter select-none -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
             {project.title.split(' ')[0]}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 h-full p-10 flex flex-col justify-between translate-z-20">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <motion.span 
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="text-purple-500 font-mono text-[10px] uppercase tracking-[0.4em] block"
            >
              // CODE_{index + 1}
            </motion.span>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
            <p className="text-gray-500 max-w-[240px] text-sm leading-relaxed font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                {project.description}
            </p>
          </div>
          
          <motion.div 
            className="p-5 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-all duration-500"
          >
            <ArrowUpRight size={24} />
          </motion.div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {['2026', 'UI/UX', 'FullStack'].map((tag, i) => (
            <motion.span 
              key={tag} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-4 py-1.5 bg-white/[0.02] group-hover:bg-purple-500/10 rounded-full text-[10px] text-gray-500 group-hover:text-purple-400 border border-white/5 transition-colors duration-500 uppercase tracking-widest font-bold"
            >
              {tag}
            </motion.span>
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
    { title: "E-Commerce OS", description: "تجربة تسوق فريدة من نوعها تعتمد على السرعة والذكاء.", size: "md:col-span-2 md:row-span-2", gradient: "from-blue-600 to-indigo-900" },
    { title: "AI Studio", description: "محرك إبداعي لتوليد المحتوى البصري.", size: "col-span-1 row-span-1", gradient: "from-purple-600 to-pink-600" },
    { title: "Crypto App", description: "مستقبل التداول بين يديك.", size: "col-span-1 row-span-1", gradient: "from-cyan-500 to-blue-600" },
    { title: "SaaS Platform", description: "إدارة الأعمال أصبحت أسهل وأكثر أناقة.", size: "md:col-span-2 md:row-span-1", gradient: "from-orange-500 to-red-600" },
  ];

  return (
    <section ref={containerRef} id="projects" dir="rtl" className="py-40 relative overflow-hidden bg-transparent">
      
      {/* نص الخلفية البارالاكس المطور */}
      <motion.div 
        style={{ x: xBg }}
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap pointer-events-none z-0 opacity-[0.03]"
      >
        <span className="text-[25vw] font-black text-white leading-none uppercase tracking-tighter select-none">
          CREATIVE DEVELOPER CREATIVE DEVELOPER
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-32">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-7xl md:text-9xl font-black text-white tracking-tighter"
          >
            مشاريع <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              استثنائية
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 auto-rows-[450px]">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}