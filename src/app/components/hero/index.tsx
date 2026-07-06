"use client";
import { useState, useRef, useEffect } from "react";
import { HeroContent } from "./HeroContent";
import { HeroActions } from "./HeroActions";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from 'next/dynamic';

// Dynamic Import مع Loading State بسيط لو حبيت
const StartProjectModal = dynamic(() => import("../ProjectModal/StartProjectModal"), {
  ssr: false,
});

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Ref لمراقبة الـ Section في الـ Viewport
  const sectionRef = useRef<HTMLElement>(null);

  // 2. تحسين الأداء: تقليل جودة الأنيميشن أو إيقافه لو اليوزر بعيد عن الـ Hero
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.style.setProperty('--hero-opacity', '1');
        } else {
          sectionRef.current?.style.setProperty('--hero-opacity', '0');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 md:pt-36 pb-16 overflow-hidden"
    >
      {/* أورورا متحركة: 3 كتل ضوئية بلون العلامة التجارية بتتحرك ببطء وعضوية */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: 'var(--hero-opacity, 1)' }}
      >
        <motion.div
          animate={{ x: [0, 60, -30, 0], y: [0, -40, 20, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[15%] w-105 h-105 bg-primary/20 blur-[110px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -50, 30, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[10%] left-[10%] w-95 h-95 bg-accent/15 blur-[110px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, 30, -40, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[-15%] left-1/3 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"
        />
      </div>

      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
        <HeroContent />
        <HeroActions onStartProject={() => setIsModalOpen(true)} />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <StartProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
