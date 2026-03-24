"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { Menu, X, ArrowLeft, ExternalLink } from "lucide-react";
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

  // تنعيم حركة الـ Progress Bar العلوي
  const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const triggerHaptic = useCallback((intensity = 15) => {
    if (window.navigator?.vibrate) window.navigator.vibrate(intensity);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsFloating(latest > 80);
    // تحديث شريط القراءة العلوي
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scaleX.set(latest / docHeight);
  });

  const toggleMenu = useCallback((state: boolean) => {
    triggerHaptic(state ? 20 : 10);
    startTransition(() => setIsOpen(state));
  }, [triggerHaptic]);

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    toggleMenu(false);
    const targetId = href.startsWith("#") ? href : `#${href}`;

    setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(targetId, {
          offset: -100,
          duration: 2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    }, 500);
  }, [lenis, toggleMenu]);

  return (
    <>
      {/* Reading Progress Line */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[101] origin-left" style={{ scaleX }} />

      <header 
        dir="rtl"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 transform-gpu
          ${isFloating ? "py-3 px-4 md:px-12" : "py-6 px-4 md:px-12"}`}
      >
        <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500
          ${isFloating ? "bg-black/40 backdrop-blur-2xl border border-white/5 p-2 pr-6 rounded-full shadow-2xl" : ""}`}>
          
          <div className="pointer-events-auto">
            <Logo />
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <AnimatePresence mode="wait">
              {!isOpen && (
                <motion.button
                  key="menu-trigger"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => toggleMenu(true)}
                  className="group flex items-center gap-4 py-2 px-6 rounded-full bg-white text-black font-cairo font-bold text-[11px] uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                >
                  القائمة
                  <div className="flex flex-col gap-1">
                     <span className="w-4 h-[2px] bg-black group-hover:w-6 transition-all" />
                     <span className="w-6 h-[2px] bg-black" />
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
            className="fixed inset-0 z-[1000] flex flex-col md:flex-row bg-[#050505] overflow-hidden transform-gpu"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left Section - Aesthetic Sidebar */}
            <aside className="hidden md:flex w-4/12 p-16 flex-col justify-between border-l border-white/[0.03] bg-[#080808]">
              <div className="space-y-12">
                <Logo />
                <div className="space-y-4">
                  <p className="text-primary font-mono text-[10px] tracking-[0.4em] uppercase">Creative Engineering</p>
                  <h2 className="text-4xl font-cairo text-white font-black leading-[1.1]">
                    نحول الخيال <br /> إلى <span className="text-white/20 italic">واقع رقمي.</span>
                  </h2>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="text-[10px] text-white/20 font-mono space-y-2 uppercase tracking-widest">
                  <p>Abu Dhabi, UAE</p>
                  <p>© 2026 MOJIMMY STUDIO</p>
                </div>
              </div>
            </aside>

            {/* Right Section - Main Navigation */}
            <section className="flex-1 p-8 md:p-20 flex flex-col justify-center relative bg-[url('/grid.png')] bg-repeat bg-center" dir="rtl">
              <button 
                onClick={() => toggleMenu(false)}
                className="absolute top-10 left-10 flex items-center gap-3 text-white/30 hover:text-primary transition-all group"
              >
                <span className="text-[10px] font-cairo font-bold uppercase tracking-widest">إغلاق</span>
                <div className="p-4 rounded-full border border-white/10 group-hover:rotate-90 transition-all duration-500 bg-white/5">
                  <X size={20} />
                </div>
              </button>

              <nav className="flex flex-col space-y-4 md:space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -50, rotateX: 45 }}
                    animate={{ opacity: 1, x: 0, rotateX: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.8 }}
                  >
                    <Link
                      href={`#${link.href}`}
                      onClick={(e) => handleScroll(e, link.href)}
                      className="group relative inline-flex items-center gap-8 overflow-hidden"
                    >
                      <span className="text-xs font-mono text-primary/40 group-hover:text-primary transition-colors">0{i + 1}</span>
                      <h1 className="text-5xl md:text-8xl font-cairo font-black text-transparent stroke-text group-hover:text-white transition-all duration-700 tracking-tighter uppercase">
                        {link.name}
                      </h1>
                      <ArrowLeft className="text-primary opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 md:block hidden" size={60} />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Social Links & Contact */}
              <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-8 items-center">
                <p className="text-[10px] text-white/20 font-cairo uppercase">تابع الرحلة:</p>
                <div className="flex gap-6">
                  {['LinkedIn', 'Instagram', 'Github'].map((soc) => (
                    <a key={soc} href="#" className="text-xs font-cairo text-white/40 hover:text-white flex items-center gap-1 group">
                      {soc} <ExternalLink size={10} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
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
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
}