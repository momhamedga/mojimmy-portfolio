"use client"
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import TechIcon from "./TechIcon";
import { TECH_STACK } from "@/src/constants/tech-data";

export default function TechStack() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const orbits = useMemo(() => ({
    inner: isMobile ? 100 : 180,
    outer: isMobile ? 180 : 340
  }), [isMobile]);

  return (
    <section className="relative h-[700px] md:h-[1000px] w-full flex items-center justify-center overflow-hidden  transform-gpu">
      
      {/* 1. المدارات النيونية - تأثير نبض خفيف */}
      {[orbits.inner, orbits.outer].map((r, i) => (
        <motion.div 
          key={i} 
          animate={{ 
            opacity: [0.02, 0.05, 0.02],
            scale: [1, 1.02, 1] 
          }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 2 }}
          className="absolute border border-white/10 rounded-full pointer-events-none z-0" 
          style={{ 
            width: r * 2, 
            height: r * 2,
            boxShadow: `inset 0 0 50px oklch(1 0 0 / 0.02)`
          }} 
        />
      ))}

      {/* 2. المركز CORE - "مفاعل الابتكار" */}
      <div className="relative z-20 group">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-32 h-32 md:w-56 md:h-56 rounded-full border border-white/5 flex items-center justify-center backdrop-blur-[40px] shadow-[0_0_100px_oklch(0.6_0.2_285_/_0.1)] transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-[0_0_120px_oklch(0.6_0.2_285_/_0.2)]"
        >
          <div className="text-center relative">
             {/* تأثير نبض خلف الكلمة */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
            
            <h3 className="relative text-white font-cairo text-2xl md:text-5xl font-black tracking-tighter leading-none">
              CORE<br/>
              <span className="text-[10px] md:text-xs text-primary font-bold tracking-[0.4em] uppercase opacity-60">Tech 2026</span>
            </h3>
          </div>
        </motion.div>

        {/* حلقات زينة حول المركز */}
        <div className="absolute inset-[-20px] border border-primary/5 rounded-full animate-spin-slow opacity-20" />
      </div>

      {/* 3. رندر الأيقونات */}
      {TECH_STACK.map((tech) => (
        <TechIcon 
          key={tech.name}
          {...tech}
          radius={tech.level === "inner" ? orbits.inner : orbits.outer}
          duration={tech.level === "inner" ? 30 : 50} // أبطأ شوية عشان تبقى أريح للعين
        />
      ))}

      {/* 4. إضاءة خلفية (Ambient Glow) */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none z-10 opacity-80" />
    </section>
  );
}