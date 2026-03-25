"use client";

import { useState, useCallback, useEffect, useTransition, useRef } from "react";
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

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bodyRef = useRef<HTMLElement | null>(null);
  const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
    if (latest > 80 && !isFloating) setIsFloating(true);
    if (latest <= 80 && isFloating) setIsFloating(false);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scaleX.set(latest / docHeight);
  });

  const toggleMenu = useCallback((state: boolean) => {
    triggerHaptic(state ? 20 : 10);
    if (bodyRef.current) {
      bodyRef.current.style.overflow = state ? "hidden" : "unset";
    }
    startTransition(() => setIsOpen(state));
  }, [triggerHaptic]);

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    toggleMenu(false);
    const targetId = href.startsWith("#") ? href : `#${href}`;
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

      <header dir="rtl" className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 transform-gpu ${isFloating ? "py-3 px-4 md:py-4 md:px-12" : "py-6 px-6 md:py-8 md:px-12"}`}>
        <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 ${isFloating ? "bg-black/40 backdrop-blur-3xl border border-white/5 p-2 pr-6 md:pr-8 rounded-full shadow-2xl" : ""}`}>
          <div className="scale-75 md:scale-90 lg:scale-100 origin-right transition-transform">
            <Logo />
          </div>
          
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {!isOpen && (
                <motion.button
                  key="menu-trigger"
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => toggleMenu(true)}
                  className="group flex items-center gap-3 py-2 px-5 md:py-2.5 md:px-7 rounded-full bg-white text-black font-cairo font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] hover:bg-purple-50 transition-all shadow-lg"
                >
                  <span className="hidden xs:inline">القائمة</span>
                  <div className="flex flex-col gap-1">
                     <span className="w-4 h-[1.5px] bg-black group-hover:w-2 transition-all" />
                     <span className="w-2.5 h-[1.5px] bg-black group-hover:w-4 transition-all" />
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
            className="fixed inset-0 z-[1000] flex flex-col lg:flex-row bg-[#050505] overflow-hidden"
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Left Panel - Hidden on Tablet and Mobile */}
            <aside className="hidden lg:flex lg:w-[35%] p-12 flex-col justify-between border-l border-white/[0.03] bg-[#070707] relative">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.03),transparent_60%)]" />
               <div className="relative z-10 space-y-8">
                  <Logo />
                  <h2 className="text-xl xl:text-2xl font-cairo text-white/90 font-bold leading-tight">
                    نصنع حلولاً <br /> رقمية <span className="text-white/20 italic font-light tracking-tight">تتخطى التوقعات.</span>
                  </h2>
               </div>
               <div className="relative z-10 text-[8px] text-white/10 font-mono uppercase tracking-[0.4em]">
                  <p>© 2026 MOJIMMY STUDIO</p>
               </div>
            </aside>

            {/* Right Panel - The Links */}
            <section className="flex-1 w-full p-6 sm:p-12 md:p-20 flex flex-col justify-center relative bg-[#050505]" dir="rtl">
              <button onClick={() => toggleMenu(false)} className="absolute top-6 left-6 md:top-12 md:left-12 p-3 rounded-full border border-white/5 hover:bg-white/5 transition-all group z-[1100]">
                <X size={16} className="text-white/50 group-hover:rotate-90 group-hover:text-white transition-all duration-500" />
              </button>

              <nav className="flex flex-col space-y-4 md:space-y-6 w-full max-w-full overflow-hidden">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                    className="w-full"
                  >
                    <Link
                      href={`#${link.href}`}
                      onClick={(e) => handleScroll(e, link.href)}
                      className="group relative flex items-baseline gap-3 md:gap-8 py-1 w-full max-w-full"
                    >
                      <span className="text-[8px] md:text-[10px] font-mono text-purple-500/40 font-bold shrink-0">0{i + 1}</span>
                      
                      {/* حل مشكلة كسر النص والتجاوب */}
                      <h1 className="text-[clamp(1.8rem,8vw,5.5rem)] font-cairo font-black text-transparent stroke-text group-hover:text-white transition-all duration-500 tracking-tighter leading-[1] whitespace-nowrap overflow-hidden text-ellipsis">
                        {link.name}
                      </h1>
                      
                      <ArrowLeft className="text-purple-500 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden sm:block shrink-0" size={24} />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/[0.03] flex flex-row gap-5 justify-between items-center w-full">
                <div className="flex gap-4 md:gap-8">
                  {['LinkedIn', 'Github'].map((soc) => (
                    <a key={soc} href="#" className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/20 hover:text-purple-400 transition-colors flex items-center gap-1 group">
                      {soc} <ExternalLink size={8} />
                    </a>
                  ))}
                </div>
                <div className="text-[7px] text-white/5 font-mono tracking-widest uppercase">
                  UAE • 2026
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.12);
          /* منع النص من الخروج عن الحاوية */
          display: inline-block;
          max-width: 100%;
        }
        @media (max-width: 768px) {
          .stroke-text {
            -webkit-text-stroke: 0.6px rgba(255, 255, 255, 0.15);
          }
        }
      `}</style>
    </>
  );
}