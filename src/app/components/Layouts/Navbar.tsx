"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Logo } from "@/src/app/components/Layouts/Logo";
import { navLinks } from "@/src/constants/navLinks";
import Link from "next/link";
import { useLenis } from "lenis/react"; // استدعاء Lenis للتحكم بالسكرول

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isPending, startTransition] = useTransition(); // React 19 transition hook
  const { scrollY } = useScroll();
  const lenis = useLenis();

  // تحسين الأداء: التحكم في الـ overflow بطريقة React 19
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  const triggerHaptic = useCallback((intensity = 15) => {
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(intensity);
    }
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50 && !isFloating) setIsFloating(true);
    else if (latest <= 50 && isFloating) setIsFloating(false);
  });

  const toggleMenu = useCallback((state: boolean) => {
    triggerHaptic(state ? 20 : 10);
    // استخدام startTransition لضمان سلاسة الأنميشن وعدم حظر الـ UI
    startTransition(() => {
      setIsOpen(state);
    });
  }, [triggerHaptic]);

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // 1. نقفل المنيو فوراً
    toggleMenu(false);

    const targetId = href.startsWith("#") ? href : `#${href}`;

    // 2. استخدام Lenis للتحرك (أفضل ممارسات React 19 مع Lenis)
    // بنعمل تأخير بسيط عشان ندي وقت لأنميشن الـ exit بتاع المنيو
    setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(targetId, {
          offset: -80,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // انسيابية عالية
        });
      }
    }, 400); 
  }, [lenis, toggleMenu]);

  return (
    <>
      <header 
        dir="rtl"
        className="fixed top-0 left-0 right-0 z-[100] p-4 md:px-12 md:py-6 flex justify-between items-center pointer-events-none transform-gpu"
      >
        <div className="pointer-events-auto">
          <Logo />
        </div>

        <div className="pointer-events-auto">
          <AnimatePresence mode="wait">
            {!isOpen && (
              <motion.button
                key="menu-trigger"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => toggleMenu(true)}
                className={`group flex items-center gap-3 py-2 px-5 rounded-full border transition-all duration-500
                  ${isFloating 
                    ? "bg-white text-black border-white shadow-xl scale-90" 
                    : "bg-white/5 text-white border-white/10 backdrop-blur-xl"}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">القائمة</span>
                <Menu size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-[1000] flex flex-col md:flex-row bg-[#030303] overflow-hidden transform-gpu"
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* الجزء الجانبي - Branding */}
            <aside className="hidden md:flex w-5/12 p-20 flex-col justify-between border-l border-white/[0.02] relative" dir="rtl">
              <div className="space-y-6">
                <Logo />
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-black text-white leading-tight"
                >
                  نصمم <span className="text-primary italic">التجربة.</span>
                </motion.h2>
                <p className="text-white/40 text-xs max-w-xs leading-relaxed">
                  حلول رقمية تجمع بين الفن والكفاءة البرمجية المطلقة من قلب أبوظبي.
                </p>
              </div>
              <footer className="text-[9px] text-white/20 font-black tracking-[0.5em] uppercase">
                Abu Dhabi • UAE
              </footer>
            </aside>

            {/* الروابط - Navigation */}
            <section className="flex-1 p-6 md:p-20 flex flex-col relative" dir="rtl">
              <div className="flex justify-between items-center mb-10 md:mb-16">
                <div className="md:hidden">
                   <Logo />
                </div>
                <button 
                  onClick={() => toggleMenu(false)}
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-all group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">رجوع</span>
                  <div className="p-3 rounded-full border border-white/5 bg-white/5 group-hover:bg-primary transition-colors">
                    <X size={18} />
                  </div>
                </button>
              </div>

              <nav className="flex flex-col space-y-2 md:space-y-4">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.name}
                    href={`#${link.href}`}
                    prefetch={false}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="group relative inline-flex items-center gap-6 py-1 overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.05) }}
                      className="flex items-baseline gap-4 will-change-transform"
                    >
                      <span className="text-[10px] font-mono text-primary/50">0{i + 1}</span>
                      <h1 className="text-4xl md:text-7xl font-black text-white/20 group-hover:text-white transition-all duration-500 tracking-tighter">
                        {link.name}
                      </h1>
                      <ArrowLeft className="text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" size={24} />
                    </motion.div>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-white/[0.03] flex justify-between items-center">
                <div className="flex gap-5 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                  <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-primary transition-colors">Behance</a>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}