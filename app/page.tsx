"use client"
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";

// استيراد المكونات
import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import Preloader from "./components/Preloader";
const loadingState = (height = "100vh") => <div className={`w-full ${height} bg-transparent`} />;
// 2. المكونات الديناميكية (تحسين التحميل)
const Projects = dynamic(() => import("./components/Projects"), { 
  ssr: false,
  loading: () => loadingState("h-[1000px]")
});
const TechStack = dynamic(() => import("./components/SkillsBento"), { 
  ssr: false,
  loading: () => loadingState("h-[1000px]")
});
const Testimonials = dynamic(() => import("./components/Testimonials"), { 
  ssr: false, loading: () => loadingState("h-[500px]") 
});
const CodeLaboratory = dynamic(() => import("./components/Laboratory"), { 
  ssr: false, loading: () => loadingState("h-[500px]") 
});
const StartProjectModal = dynamic(() => import("./components/StartProjectModal"), { ssr: false });
const ProcessSection = dynamic(() => import("./components/Process"), { 
  ssr: false, 
  loading: () => loadingState("h-[600px]") 
});
const CommandPalette = dynamic(() => import("./components/CommandPalette"), { 
  ssr: false, 
  loading: () => loadingState("h-[600px]") 
});
const About = dynamic(() => import("./components/About"), { 
  ssr: false, loading: () => loadingState("h-[400px]") 
});
const Services = dynamic(() => import("./components/Services"), { 
  ssr: false, loading: () => loadingState("h-[600px]") 
});

const FAQ = dynamic(() => import("./components/FAQ"), { 
  ssr: false, loading: () => loadingState("h-[500px]") 
});
const Contact = dynamic(() => import("./components/Contact"), { 
  ssr: false, 
  loading: () => loadingState("h-[600px]") 
});
const Footer = dynamic(() => import("./components/Footer"), { ssr: false });

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
// في page.tsx
const springX = useSpring(mouseX, { stiffness: 40, damping: 30, restDelta: 0.001 });
const springY = useSpring(mouseY, { stiffness: 40, damping: 30, restDelta: 0.001 });

  // توهج خلفي موحد لكل الموقع
  const background = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.08), transparent 80%)`;



useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    // استخدام requestAnimationFrame لتحسين أداء حركة الماوس
    window.requestAnimationFrame(() => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    });
  }

  if (!mounted) return null;

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#020202] overflow-x-hidden selection:bg-purple-500/30"
    >
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>

    {/* 1. الطبقة الخلفية الموحدة (ثابتة خلف كل شيء) */}
<div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        {/* إضافة transform-gpu لتحسين استهلاك المعالج */}
        <motion.div className="absolute inset-0 transform-gpu" style={{ background }} />
      </div>

  {/* 2. طبقة المحتوى */}
      <div className="relative z-10">
        <Navbar />
        <Hero onStartProject={() => setIsModalOpen(true)} />
        {/* جميع السكاشن هنا بدون أي bg-colors داخلها */}
       
        <TechStack/>
        <CommandPalette/>
        <About />
        <Services />
        <Projects />
        <CodeLaboratory />
        <Testimonials />
   
        <ProcessSection />
        <FAQ />
        <Contact />
        <Footer />
      </div>
      {/* الـ Modals دايمًا في أعلى Z-index */}
      <AnimatePresence>
        {isModalOpen && (
          <StartProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  ); 
}