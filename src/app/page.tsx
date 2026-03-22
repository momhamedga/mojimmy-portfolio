"use client"
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";

// 1. المكونات الأساسية (التحميل الفوري لضمان سرعة الـ LCP)
import Navbar from "./components/Layouts/Navbar";
import Hero from "./components/hero";
import Preloader from "./components/Preloader";

// دالة الـ Loading المحسنة لمنع اهتزاز الصفحة
const SectionLoader = ({ h }: { h: string }) => (
  <div style={{ height: h }} className="w-full bg-transparent flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

// 2. المكونات الديناميكية مع تحسين الـ Priority
const TechStack = dynamic(() => import("./components/tech-stack"), { 
  ssr: false, loading: () => <SectionLoader h="600px" /> 
});
const About = dynamic(() => import("./components/about/About"), { 
  ssr: false, loading: () => <SectionLoader h="400px" /> 
});
const Services = dynamic(() => import("./components/services/"), { 
  ssr: false, loading: () => <SectionLoader h="600px" /> 
});
const Projects = dynamic(() => import("./components/projects"), { 
  ssr: false, loading: () => <SectionLoader h="1000px" /> 
});
const CodeLaboratory = dynamic(() => import("./components/lab/CodeLaboratory"), { 
  ssr: false, loading: () => <SectionLoader h="500px" /> 
});
const Testimonials = dynamic(() => import("./components/testimonials/Testimonials"), { 
  ssr: false, loading: () => <SectionLoader h="400px" /> 
});
const ProcessSection = dynamic(() => import("./components/Process/ProcessSection"), { 
  ssr: false, loading: () => <SectionLoader h="600px" /> 
});
const FAQ = dynamic(() => import("./components/FAQ/InteractiveFAQ"), { 
  ssr: false, loading: () => <SectionLoader h="500px" /> 
});
const Contact = dynamic(() => import("./components/contact/Contact"), { 
  ssr: false, loading: () => <SectionLoader h="600px" /> 
});

const Footer = dynamic(() => import("./components/footer/Footer"), { ssr: false });
const StartProjectModal = dynamic(() => import("./components/ProjectModal/StartProjectModal"), { ssr: false });

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // نظام تتبع الماوس مع تنعيم (Spring)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 28 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.1), transparent 80%)`;

  useEffect(() => {
    setMounted(true);
    
    // التحقق لو الجهاز موبايل لتعطيل الـ mousemove توفيراً للطاقة
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const handleMove = (e: MouseEvent) => {
      if (isTouchDevice) return;
      window.requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };

    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMove);
    }

    const timer = setTimeout(() => setIsLoading(false), 1500);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearTimeout(timer);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-[#020202] overflow-x-hidden selection:bg-purple-500/30 font-sans">
      
      {/* 1. الـ Preloader */}
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      {/* 2. طبقة الخلفية (Fixed) لضمان عدم التداخل مع السكرول */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* الـ Grid الهادئ */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, 
            backgroundSize: '70px 70px' 
          }} 
        />
        {/* الـ Dynamic Glow (يعمل على الكمبيوتر فقط بسلاسة) */}
        <motion.div 
          className="absolute inset-0 transform-gpu" 
          style={{ background }} 
        />
      </div>

      {/* 3. المحتوى الأساسي (z-10 ليكون فوق الخلفية) */}
      <div className="relative z-10 flex flex-col w-full">
        <Navbar />
        
        {/* تغليف السكاشن بـ div يضمن الـ Layout الصحيح */}
        <div className="flex flex-col">
          <Hero onStartProject={() => setIsModalOpen(true)} />
          
          {/* سكشن المشاريع - القلب النابض للموقع */}
          <Projects />
          
          <TechStack />
          <About />
          <Services />
          <CodeLaboratory />
          <Testimonials />
          <ProcessSection />
          <FAQ />
          <Contact />
        </div>

        <Footer />
      </div>

      {/* 4. الـ Modals والـ Overlays */}
      <AnimatePresence>
        {isModalOpen && (
          <StartProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
      
    </main>
  ); 
}