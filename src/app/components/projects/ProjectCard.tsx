"use client"
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowUpLeft } from "lucide-react"; // استخدام السهم المتجه لليسار لأننا RTL
import { Project } from "@/src/types/project";

export function ProjectCard({ project, index }: { project: Project, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // منطق الـ Tilt للديسكتوب
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [isMobile, x, y]);

  // منطق الـ Parallax خلفية الكارت أثناء السكرول
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ 
        rotateX: isMobile ? 0 : rotateX, 
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d" 
      }}
      className={`${project.size} relative group rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] overflow-hidden min-h-[420px] cursor-pointer`}
    >
      {/* طبقة الخلفية المتحركة */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div style={{ y: bgY }} className="h-[120%] w-full relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
             <span className="text-[12rem] font-black uppercase rotate-12 select-none tracking-tighter">
               {project.id}
             </span>
          </div>
        </motion.div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-between" dir="rtl">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <span className="text-purple-500 font-mono text-xs uppercase tracking-[0.3em]">
              مشروع // {project.id}
            </span>
            <h3 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter transition-transform duration-500 group-hover:-translate-x-2">
              {project.title}
            </h3>
            <p className="text-gray-400 max-w-sm text-sm md:text-lg font-medium leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 md:block hidden">
              {project.description}
            </p>
            {/* للموبايل يظهر الوصف دائماً */}
            <p className="text-gray-400 text-sm md:hidden block leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* زر السهم مع تاتش إبداعي */}
          <motion.a
            href={project.link}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-2xl"
          >
            <ArrowUpLeft className="w-6 h-6 md:w-10 md:h-10" />
          </motion.a>
        </div>

        {/* التاجات */}
        <div className="flex flex-wrap gap-2 mt-10 md:mt-0">
          {project.tags.map(tag => (
            <span key={tag} className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/5 rounded-full text-[10px] md:text-xs text-gray-300 font-bold uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}