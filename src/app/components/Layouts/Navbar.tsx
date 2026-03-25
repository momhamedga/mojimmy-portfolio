"use client";

import { useState, useCallback, useEffect, useTransition, useRef } from "react"; // إضافة useRef
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { X, ArrowLeft, ExternalLink } from "lucide-react";
import { Logo } from "@/src/app/components/Layouts/Logo";
import { navLinks } from "@/src/constants/navLinks";
import Link from "next/link";
import { useLenis } from "lenis/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { scrollY } = useScroll();
  const lenis = useLenis();

  // 1. Refs للتحكم المباشر وتجنب الـ Re-renders
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bodyRef = useRef<HTMLElement | null>(null);

  const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // تحكم مباشر في الـ Scrollbar بدون useEffect ثقيل
  useEffect(() => {
    bodyRef.current = document.body;
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const triggerHaptic = useCallback((intensity = 15) => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(intensity);
    }
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // تحديث الحالة فقط عند الضرورة (Threshold)
    if (latest > 80 && !isFloating) setIsFloating(true);
    if (latest <= 80 && isFloating) setIsFloating(false);
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scaleX.set(latest / docHeight);
  });

  const toggleMenu = useCallback((state: boolean) => {
    triggerHaptic(state ? 20 : 10);
    
    // تحكم مباشر في الـ DOM لضمان السرعة القصوى
    if (bodyRef.current) {
      bodyRef.current.style.overflow = state ? "hidden" : "unset";
    }
    
    startTransition(() => setIsOpen(state));
  }, [triggerHaptic]);

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    toggleMenu(false);

    const targetId = href.startsWith("#") ? href : `#${href}`;

    // تنظيف أي تايمر قديم قبل البدء
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(targetId, {
          offset: -80,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    }, 600);
  }, [lenis, toggleMenu]);

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-purple-500 z-[1001] origin-right" 
        style={{ scaleX }} 
      />

      <header dir="rtl" className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 transform-gpu ${isFloating ? "py-4 px-6 md:px-12" : "py-8 px-6 md:px-12"}`}>
        <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 ${isFloating ? "bg-black/20 backdrop-blur-3xl border border-white/5 p-2 pr-8 rounded-full shadow-2xl" : ""}`}>
          <Logo />
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {!isOpen && (
                <motion.button
                  key="menu-trigger"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => toggleMenu(true)}
                  className="group flex items-center gap-4 py-2.5 px-7 rounded-full bg-white text-black font-cairo font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  القائمة
                  <div className="flex flex-col gap-1">
                     <span className="w-5 h-[1.5px] bg-black group-hover:w-3 transition-all" />
                     <span className="w-3 h-[1.5px] bg-black group-hover:w-5 transition-all" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-[1000] flex flex-col md:flex-row bg-[#050505] overflow-hidden"
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left Panel */}
            <aside className="hidden md:flex w-[35%] p-16 flex-col justify-between border-l border-white/[0.03] bg-[#070707] relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.05),transparent_70%)]" />
               <div className="relative z-10 space-y-10">
                  <Logo />
                  <div className="space-y-4">

                    <h2 className="text-3xl font-cairo text-white font-black leading-tight">
                      نصنع حلولاً <br /> رقمية <span className="text-white/10 italic font-light">تتخطى التوقعات.</span>
                    </h2>
                  </div>
               </div>
               <div className="relative z-10 text-[9px] text-white/20 font-mono uppercase tracking-[0.3em] space-y-2">
                  <p>Abu Dhabi • United Arab Emirates</p>
                  <p>© 2026 Mojimmy Studio</p>
               </div>
            </aside>

            {/* Right Panel */}
            <section className="flex-1 p-8 md:p-16 flex flex-col justify-center relative bg-[#050505]" dir="rtl">
              <button onClick={() => toggleMenu(false)} className="absolute top-10 left-10 p-4 rounded-full border border-white/5 hover:bg-white/5 transition-all group">
                <X size={18} className="text-white/40 group-hover:rotate-90 group-hover:text-white transition-all duration-500" />
              </button>

              <nav className="flex flex-col space-y-2 md:space-y-4 max-w-4xl">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 30 }} 
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.08), duration: 0.6 }}
                  >
                    <Link
                      href={`#${link.href}`}
                      onClick={(e) => handleScroll(e, link.href)}
                      className="group relative inline-flex items-center gap-6 md:gap-10 py-1"
                    >
                      <span className="text-[10px] font-mono text-purple-500/30 group-hover:text-purple-500 transition-colors pt-2">0{i + 1}</span>
                      <h1 className="text-4xl md:text-7xl font-cairo font-black text-transparent stroke-text group-hover:text-white transition-all duration-500 tracking-tighter leading-none">
                        {link.name}
                      </h1>
                      <ArrowLeft className="text-purple-500 opacity-0 -translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden md:block" size={40} />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8 items-center">
                <div className="flex gap-6">
                  {['LinkedIn', 'Github', 'Behance'].map((soc) => (
                    <a key={soc} href="#" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all flex items-center gap-2 group">
                      {soc} <ExternalLink size={10} className="group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.08);
          letter-spacing: -0.02em;
        }
      `}</style>
    </>
  );
}