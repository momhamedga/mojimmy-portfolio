"use client"
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";

// استيراد المكونات
import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import Preloader from "./components/Preloader";

// 2. المكونات الديناميكية (تحسين التحميل)
const Projects = dynamic(() => import("./components/Projects"), { ssr: false });
const Testimonials = dynamic(() => import("./components/Testimonials"), { ssr: false });
const StartProjectModal = dynamic(() => import("./components/StartProjectModal"), { ssr: false });
const Skills = dynamic(() => import("./components/Skills"), { ssr: false });
const About = dynamic(() => import("./components/About"), { ssr: false });
const Services = dynamic(() => import("./components/Services"), { ssr: false });
const Experience = dynamic(() => import("./components/Experience"), { ssr: false });
const FAQ = dynamic(() => import("./components/FAQ"), { ssr: false });
const Contact = dynamic(() => import("./components/Contact"), { ssr: false });
const Footer = dynamic(() => import("./components/Footer"), { ssr: false });

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const background = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.1), transparent 80%)`;

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    mouseX.set(clientX);
    mouseY.set(clientY);
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

      {/* 1. الطبقة الخلفية المطلقة (The Unified Canvas) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* الـ Grid الثابت اللي مش بيتحرك مع السكرول */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{
            backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} 
        />
        {/* توهج الماوس اللي بيتحرك في الخلفية كلها */}
        <motion.div className="absolute inset-0" style={{ background }} />
      </div>

      {/* 2. طبقة المحتوى (The Interactive Layer) */}
      <div className="relative z-10 w-full">
        <Navbar />
        
        {/* ملاحظة: شيلنا أي bg-colors من السكاشن */}
        <Hero onStartProject={() => setIsModalOpen(true)} />
        
        {/* السكاشن الآن تسبح فوق الخلفية الثابتة */}
        <div className="relative">
          <Skills />
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

      {/* الـ Modals دايمًا في أعلى Z-index */}
      <AnimatePresence>
        {isModalOpen && (
          <StartProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  ); 
}