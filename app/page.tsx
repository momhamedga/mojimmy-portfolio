"use client"
import { useState, useEffect } from "react";
// استيراد المكون الجديد
import StartProjectModal from "./components/StartProjectModal"; 
import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import Skills from "./components/Skills";
import About from "./components/About";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";

import Preloader from "./components/Preloader";
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";
import GravitySkills from "./components/GravitySkills";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. حالة التحكم في الـ Modal (ابدأ مشروعك)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const background = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.07), transparent 80%)`;

  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 2500);
  }, []);

  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    mouseX.set(clientX);
    mouseY.set(clientY);
  }

  if (!mounted) return null;

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#030303] selection:bg-purple-500/30 overflow-x-hidden"
    >
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      {/* --- الطبقات الثابتة --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }} 
      />

      <motion.div className="fixed inset-0 z-0 pointer-events-none" style={{ background }} />

      {/* --- المحتوى --- */}
      <div className="relative z-10 w-full">
        {/* نمرر دالة الفتح للـ Navbar ليعمل زر "تواصل معي" أو أي زر هناك */}
        <Navbar />
        
        {/* نمرر دالة الفتح للـ Hero لزر "ابدأ مشروعك" */}
        <Hero onStartProject={() => setIsModalOpen(true)} />
        
        <div className="space-y-32 pb-20">
          <Skills />
          <GravitySkills />
          <About />
          <Projects />
          <Services />
          <Experience />
          <Testimonials />
          <FAQ />
          <Contact />
        </div>
        
        <Footer />
      </div>

      {/* --- استدعاء الـ Modal في نهاية الـ Main --- */}
      <StartProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}