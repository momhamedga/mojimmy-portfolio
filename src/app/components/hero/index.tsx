"use client";
import { useState, useRef, useEffect } from "react";
import { HeroContent } from "./HeroContent";
import { HeroActions } from "./HeroActions";
import { AnimatePresence } from "framer-motion";
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
      className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden"
    >
      {/* 3. الإضاءة العلوية باستخدام Ref-logic خفي */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full transition-opacity duration-1000"
        style={{ opacity: 'var(--hero-opacity, 1)' }}
      />

    

      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
        <HeroContent />
        <HeroActions onStartProject={() => setIsModalOpen(true)} />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <StartProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* لمسة نهائية: الـ Grain Texture اللي بيخلي التصميم Cinematic */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </section>
  );
}