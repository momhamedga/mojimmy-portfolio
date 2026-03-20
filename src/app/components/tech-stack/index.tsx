"use client"
import { useState, useEffect, useMemo } from "react";
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
    inner: isMobile ? 90 : 160,
    outer: isMobile ? 170 : 300
  }), [isMobile]);

  return (
    <section className="relative h-[600px] md:h-[900px] w-full flex items-center justify-center overflow-hidden bg-transparent">
      
      {/* المدارات البصرية (خلفية فقط) */}
      {[orbits.inner, orbits.outer].map((r, i) => (
        <div 
          key={i} 
          className="absolute border border-white/[0.03] rounded-full pointer-events-none z-10" 
          style={{ width: r * 2, height: r * 2 }} 
        />
      ))}

      {/* المركز CORE */}
      <div className="relative z-20 group">
        <div className="w-28 h-28 md:w-44 md:h-44 rounded-full bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-2xl transition-all duration-500 group-hover:border-purple-500/20">
          <div className="text-center">
            <h3 className="text-white font-black text-xl md:text-3xl tracking-tighter leading-none uppercase">Core</h3>
            <p className="text-[8px] md:text-[10px] text-gray-500 font-mono mt-1 tracking-widest uppercase">Stack 2026</p>
          </div>
        </div>
      </div>

      {/* رندر جميع الأيقونات من البيانات الموحدة */}
      {TECH_STACK.map((tech) => (
        <TechIcon 
          key={tech.name}
          {...tech}
          radius={tech.level === "inner" ? orbits.inner : orbits.outer}
          duration={tech.level === "inner" ? 25 : 40} 
        />
      ))}
    </section>
  );
}