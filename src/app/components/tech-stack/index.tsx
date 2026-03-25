"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechIcon from "./TechIcon";
import { TECH_STACK } from "@/src/constants/tech-data";

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
// 1. اجعل الحالة الابتدائية ذكية (Lazy Initialization)
// دي بتتحسب مرة واحدة فقط عند التحميل وتغنيك عن setIsMobile جوه الـ Effect
const [isMobile, setIsMobile] = useState(() => 
  typeof window !== 'undefined' ? window.innerWidth < 768 : false
);
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  // 2. تحديث isLoaded في الفريم القادم لضمان سلاسة الأنيميشن ومنع الـ Warning
  const raf = requestAnimationFrame(() => {
    setIsLoaded(true);
  });

  const handleMouseMove = (e: MouseEvent) => {
    // نستخدم قيمة الـ isMobile الحالية من الـ state
    if (isMobile || !containerRef.current) return;

    const { clientX, clientY } = e;
    const rect = containerRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (clientX - centerX) * 0.05;
    const y = (clientY - centerY) * 0.05;

    // تحديث الـ CSS Variables مباشرة للأداء العالي (120fps)
    containerRef.current.style.setProperty('--tx', `${x}px`);
    containerRef.current.style.setProperty('--ty', `${y}px`);
    containerRef.current.style.setProperty('--otx', `${-x * 0.3}px`);
    containerRef.current.style.setProperty('--oty', `${-y * 0.3}px`);
  };

  const onResize = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
  };

  window.addEventListener("resize", onResize);
  window.addEventListener("mousemove", handleMouseMove);
  
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", handleMouseMove);
  };
}, [isMobile]); // التبعية هنا صحيحة لمزامنة الـ MouseMove عند تغير الحجم
  const orbits = useMemo(() => ({
    inner: isMobile ? 110 : 200,
    outer: isMobile ? 190 : 380
  }), [isMobile]);

  // منع الـ Layout Shift بتثبيت الطول أثناء التحميل
  if (!isLoaded) return <div className="h-[600px] md:h-[950px]" />;

  return (
    <section 
      ref={containerRef}
      className="relative h-[600px] md:h-[950px] w-full flex items-center justify-center overflow-hidden bg-transparent transform-gpu will-change-transform selection-none"
    >
      
      {/* 1. مدارات سينمائية - مضاف لها تأثير الـ Parallax */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-500 ease-out"
        style={{ transform: 'translate(var(--otx, 0px), var(--oty, 0px))' }}
      >
        {[orbits.inner, orbits.outer].map((r, i) => (
          <div 
            key={i}
            className="absolute rounded-full border border-white/[0.04]"
            style={{ 
              width: r * 2, 
              height: r * 2,
              boxShadow: `inset 0 0 100px oklch(0.6 0.2 285 / 0.02)`
            }} 
          />
        ))}
      </div>

      {/* 2. مفاعل الطاقة المركزي (CORE) */}
      <div 
        ref={coreRef}
        style={{ 
          transform: 'translate(var(--tx, 0px), var(--ty, 0px))',
          transition: 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)' 
        }}
        className="relative z-20 group"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          className="w-36 h-36 md:w-64 md:h-64 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 animate-pulse" />
          
          <div className="text-center relative z-10">
            <h3 className="text-white font-cairo text-3xl md:text-6xl font-black tracking-tighter leading-none select-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">CORE</span>
              <br/>
              <motion.span 
                animate={{ opacity: [0.3, 0.8, 0.3], letterSpacing: ["0.3em", "0.6em", "0.3em"] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-[10px] md:text-xs text-purple-400 font-bold uppercase block mt-2"
              >
                Tech Stack
              </motion.span>
            </h3>
          </div>

          {/* Glow Effect */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0 bg-purple-500 blur-[60px] rounded-full"
          />
        </motion.div>

        {/* Orbiting dashed ring */}
        <div className="absolute inset-[-20px] border border-dashed border-white/10 rounded-full animate-[spin_100s_linear_infinite] opacity-40" />
      </div>

      {/* 3. توزيع الأيقونات الذكي */}
      <AnimatePresence mode="popLayout">
        {TECH_STACK.map((tech, index) => (
          <TechIcon 
            key={tech.name}
            {...tech}
            index={index}
            radius={tech.level === "inner" ? orbits.inner : orbits.outer}
            duration={isMobile ? (tech.level === "inner" ? 25 : 40) : (tech.level === "inner" ? 45 : 85)}
          />
        ))}
      </AnimatePresence>

      {/* 4. Ambient Particle Effect - محسن */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping delay-300" />
        <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-blue-500/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-purple-500/10 rounded-full blur-sm" />
      </div>

    </section>
  );
}