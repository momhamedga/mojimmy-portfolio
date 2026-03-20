"use client"
import { useRef, memo, useEffect, useState } from "react";
import { BackgroundEffect } from "./BackgroundEffect";
import { HeroContent } from "./HeroContent";
import { HeroActions } from "./HeroActions";
import { motion, AnimatePresence } from "framer-motion";
import { HeroProps } from "@/src/types/hero";
import { useMousePosition } from "../../hooks/useMousePosition";

const Hero = memo(({ onStartProject }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const { springX, springY, updateMousePosition } = useMousePosition();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section 
      ref={sectionRef}
      id="home"
      dir="rtl" // دعم العربية من الجذور
      onMouseMove={(e) => updateMousePosition(e, sectionRef)}
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303]"
    >
      {/* 1. تأثير الخلفية (GPU Accelerated) */}
      <BackgroundEffect springX={springX} springY={springY} />
      
      {/* 2. حاوية المحتوى - تحسين المسافات للموبايل */}
      <div className="relative z-10 container mx-auto px-6 max-w-5xl flex flex-col items-center text-center">
        <HeroContent />
        <HeroActions onStartProject={onStartProject} />
      </div>

      {/* 3. مؤشر النزول المطور (Scroll Indicator) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 flex flex-col items-center gap-3 hidden md:flex"
      >
        <span className="font-mono text-[9px] tracking-[0.4em] text-gray-500 uppercase italic">اسحب للأسفل</span>
        <div className="relative w-[1px] h-14 bg-white/5 overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-1/2 bg-gradient-to-b from-transparent via-purple-500 to-transparent"
          />
        </div>
      </motion.div>

      {/* لمسة إبداعية للموبايل فقط: توهج سفلي ناعم */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none md:hidden" />
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;