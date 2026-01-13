"use client"
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic'; // استيراد الأداة السحرية للسرعة
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";

// 1. مكونات خفيفة يتم تحميلها فوراً
import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import Preloader from "./components/Preloader";

// 2. المكونات الثقيلة (Dynamic Import) - يتم تحميلها في الخلفية

const Projects = dynamic(() => import("./components/Projects"), { ssr: false });
const Testimonials = dynamic(() => import("./components/Testimonials"), { ssr: false });
const StartProjectModal = dynamic(() => import("./components/StartProjectModal"), { ssr: false });

// مكونات متوسطة الثقل
const Skills = dynamic(() => import("./components/Skills"));
const About = dynamic(() => import("./components/About"));
const Services = dynamic(() => import("./components/Services"));
const Experience = dynamic(() => import("./components/Experience"));
const FAQ = dynamic(() => import("./components/FAQ"));
const Contact = dynamic(() => import("./components/Contact"));
const Footer = dynamic(() => import("./components/Footer"));

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const background = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.07), transparent 80%)`;

  useEffect(() => {
    setMounted(true);
    // تقليل وقت الـ Preloader لـ 2000ms بدلاً من 2500ms لسرعة الاستجابة
    const timer = setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 2000);
    return () => clearTimeout(timer);
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

      {/* --- الطبقة الشبكية (Grid) --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
             backgroundSize: '50px 50px'
           }} 
      />

      <motion.div className="fixed inset-0 z-0 pointer-events-none" style={{ background }} />

      {/* --- المحتوى الرئيسي --- */}
      <div className="relative z-10 w-full">
        <Navbar />
        
        <Hero onStartProject={() => setIsModalOpen(true)} />
        
        <div className="space-y-32 pb-20">
          <Skills />
          {/* لن يظهر إلا بعد تحميله في الخلفية، مما يسرع الصفحة الرئيسية */}
         
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

      {/* استدعاء الـ Modal بشكل ديناميكي */}
      <StartProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}