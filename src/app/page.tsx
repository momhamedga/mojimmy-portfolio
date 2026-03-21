"use client"
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "framer-motion";

// 1. المكونات الأساسية (LCP Optimization)
import Navbar from "./components/Layouts/Navbar";
import Hero from "./components/hero";
import Preloader from "./components/Preloader";

// دالة الـ Loading (تستخدم داخل الـ Object Literal)
const SectionLoader = ({ h }: { h: string }) => (
  <div style={{ height: h }} className="w-full bg-transparent" />
);

// 2. المكونات الديناميكية (لازم الـ Object يكون صريح هنا 👇)
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
  ssr: false, loading: () => <SectionLoader h="500px" /> 
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 45, damping: 30, restDelta: 0.001 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const background = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(147, 51, 234, 0.08), transparent 80%)`;

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => {
      window.requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };
    window.addEventListener("mousemove", handleMove);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearTimeout(timer);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-[#020202] overflow-x-hidden selection:bg-purple-500/30">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`, 
            backgroundSize: '60px 60px' 
          }} 
        />
        <motion.div className="absolute inset-0 transform-gpu" style={{ background }} />
      </div>

      <div className="relative z-10 flex flex-col">
        <Navbar />
        <Hero onStartProject={() => setIsModalOpen(true)} />
        <TechStack />
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

      <AnimatePresence>
        {isModalOpen && (
          <StartProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  ); 
}