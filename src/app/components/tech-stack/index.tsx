"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechIcon from "./TechIcon";
import { TECH_STACK } from "@/src/constants/tech-data";

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || !containerRef.current) return;
      const { clientX, clientY } = e;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (clientX - (rect.left + rect.width / 2)) * 0.03;
      const y = (clientY - (rect.top + rect.height / 2)) * 0.03;

      containerRef.current.style.setProperty('--tx', `${x}px`);
      containerRef.current.style.setProperty('--ty', `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  const orbits = useMemo(() => ({
    inner: isMobile ? 120 : 220,
    outer: isMobile ? 200 : 400
  }), [isMobile]);

  if (!isLoaded) return <div className="h-[700px] bg-background" />;

  return (
    <section 
      ref={containerRef}
      className="relative h-[700px] md:h-[1000px] w-full flex items-center justify-center overflow-hidden  select-none transform-gpu"
    >
      {/* المدارات */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        {[orbits.inner, orbits.outer].map((r, i) => (
          <div 
            key={i}
            className="absolute rounded-full border border-primary/10"
            style={{ width: r * 2, height: r * 2 }} 
          />
        ))}
      </div>

      {/* المحرك المركزي (CORE) */}
      <motion.div 
        style={{ x: 'var(--tx)', y: 'var(--ty)' }}
        className="relative z-20"
      >
        <div className="w-40 h-40 md:w-72 md:h-72 rounded-full border border-primary/20 flex items-center justify-center backdrop-blur-3xl relative shadow-[0_0_100px_var(--color-primary-transparent)]">
          <div className="text-center">
            <h2 className="text-4xl md:text-7xl font-black font-cairo bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">
              CORE
            </h2>
            <p className="text-[10px] md:text-xs text-primary font-bold tracking-[0.4em] uppercase mt-2">
              Technology stack
            </p>
          </div>
          {/* تأثير النبض */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full"
          />
        </div>
      </motion.div>

      {/* توزيع الأيقونات */}
      {TECH_STACK.map((tech) => (
        <TechIcon 
          key={tech.name}
          {...tech}
          radius={tech.level === "inner" ? orbits.inner : orbits.outer}
          duration={tech.level === "inner" ? 40 : 80}
        />
      ))}
    </section>
  );
}