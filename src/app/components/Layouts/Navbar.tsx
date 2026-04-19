"use client";

import { useState, useCallback, useEffect, useTransition, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { X, ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { Logo } from "@/src/app/components/Layouts/Logo";
import { navLinks } from "@/src/constants/navLinks";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useTimeTheme } from "./TimeAwareProvider";

export default function Navbar() {
  const { mode } = useTimeTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { scrollY } = useScroll();
  const lenis = useLenis();

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bodyRef = useRef<HTMLElement | null>(null);
  const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // 1. إدارة السكرول عند فتح المنيو (حل مشكلة تجميد بكرة الماوس)
  useEffect(() => {
    bodyRef.current = document.body;
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      // إضافة overscroll-behavior لمنع التحديث باللمس على الموبايل
      document.body.style.overscrollBehavior = "contain";
    } else {
      lenis?.start();
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
      document.body.style.overscrollBehavior = "";
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "unset";
      document.body.style.overscrollBehavior = "";
    };
  }, [isOpen, lenis]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 80 && !isFloating) setIsFloating(true);
    if (latest <= 80 && isFloating) setIsFloating(false);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scaleX.set(latest / docHeight);
  });

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.startsWith("#") ? href : `#${href}`;
    
    // تأخير بسيط عشان نضمن إن الـ Lenis بدأ يشتغل تاني قبل ما نطلب منه يروح للمكان
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(targetId, {
          offset: -80,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    }, 450); // وقت خروج الأنميشن
  }, [lenis]);

  return (
    <>
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[1100] origin-right transition-colors duration-[2000ms]" 
        style={{ scaleX, backgroundColor: "var(--color-primary)", boxShadow: "0 0 15px var(--color-primary)" }} 
      />

      <header dir="rtl" className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 transform-gpu ${isFloating ? "py-3 px-4 md:py-4 md:px-12" : "py-6 px-6 md:py-8 md:px-12"}`}>
        <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 ${isFloating ? "bg-black/40 backdrop-blur-3xl border border-white/5 p-2 pr-6 md:pr-8 rounded-full shadow-2xl" : ""}`}>
          <div className="scale-75 md:scale-90 lg:scale-100 origin-right transition-transform">
            <Logo />
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 transition-colors duration-[2000ms]">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_var(--color-primary)]" style={{ backgroundColor: "var(--color-primary)" }} />
                <span className="text-[8px] font-mono text-white/40 tracking-[0.2em] uppercase">Status: {mode}</span>
             </div>

            <AnimatePresence mode="wait">
              {!isOpen && (
                <motion.button
                  key="menu-trigger"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setIsOpen(true)}
                  className="group flex items-center gap-3 py-2 px-5 md:py-2.5 md:px-7 rounded-full bg-white text-black font-cairo font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] transition-all"
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
            initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} // حركة دخول من فوق (Premium feel)
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Left Panel - Visuals */}
            <aside className="hidden lg:flex lg:w-[35%] p-12 flex-col justify-between border-l border-white/[0.03] bg-[#070707] relative transition-colors duration-[2000ms]">
               <div className="absolute inset-0 transition-opacity duration-[2000ms]" 
                    style={{ background: `radial-gradient(circle at center left, var(--color-primary), transparent 70%)`, opacity: 0.05 }} />
               
               <div className="relative z-10 space-y-8">
                  <Logo />
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-2xl xl:text-3xl font-cairo text-white font-black leading-[1.1] tracking-tighter">
                        {mode === 'morning' && "صباح الخير،"}
                        {mode === 'afternoon' && "يوم سعيد،"}
                        {mode === 'evening' && "مساء الإبداع،"}
                        {mode === 'night' && "أهلاً بك،"}
                        <br /> <span style={{ color: "var(--color-primary)" }}>جيمي</span> بانتظارك
                    </h2>
                  </motion.div>
               </div>

               <div className="relative z-10 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_12px_var(--color-primary)]" style={{ backgroundColor: "var(--color-primary)" }} />
                  <p className="text-[9px] text-white/40 font-mono uppercase tracking-[0.4em]">United Arab Emirates</p>
               </div>
            </aside>

            {/* Right Panel - Links Section */}
            {/* التعديل الجوهري: 
                1. استخدمنا h-full لضمان إن الحاوية واخدة الطول كله.
                2. justify-center عشان نخلي الروابط دايماً في النص.
            */}
            <section className="flex-1 h-full w-full p-6 sm:p-12 md:p-20 flex flex-col justify-center relative bg-[#050505]" dir="rtl">
              <button onClick={() => setIsOpen(false)} className="absolute top-8 left-8 p-3 rounded-full border border-white/5 hover:bg-white/5 transition-all group z-[1100]">
                <X size={20} className="text-white/50 group-hover:rotate-90 group-hover:text-white transition-all duration-500" />
              </button>

              {/* 3. حل مشكلة القص: max-h-[70vh] بتدي مساحة للسكرول من غير ما تقص الروابط */}
              <div className="w-full max-h-[70vh] overflow-y-auto pr-4 custom-nav-scroll overscroll-contain">
                <nav className="flex flex-col space-y-4 md:space-y-6 lg:space-y-8 w-full">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -30 }} 
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (i * 0.05) }}
                      className="w-full"
                    >
                      <Link
                        href={`#${link.href}`}
                        onClick={(e) => handleScroll(e, link.href)}
                        className="group relative flex items-baseline gap-4 md:gap-10 py-2 w-full"
                      >
                        <span className="text-[10px] md:text-[12px] font-mono font-bold shrink-0 transition-colors duration-[2000ms]" 
                              style={{ color: "var(--color-primary)" }}>
                          0{i + 1}
                        </span>
                        
                        <h1 className="text-[clamp(2.5rem,7vw,7rem)] font-cairo font-black text-transparent stroke-text group-hover:text-white transition-all duration-500 tracking-tighter leading-[0.9] whitespace-nowrap">
                          {link.name}
                        </h1>
                        
                        <ArrowLeft 
                          className="opacity-0 translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden lg:block shrink-0" 
                          style={{ color: "var(--color-primary)" }}
                          size={45} 
                        />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Bottom Socials */}
              <div className="mt-12 pt-8 border-t border-white/[0.03] flex flex-row gap-5 justify-between items-center w-full">
                <div className="flex gap-6 md:gap-10">
                  {['LinkedIn', 'Github', 'Instagram'].map((soc) => (
                    <a key={soc} href="#" className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 hover:text-white transition-colors flex items-center gap-1.5 group">
                      {soc} <ExternalLink size={10} className="group-hover:-translate-y-0.5 transition-transform opacity-50" />
                    </a>
                  ))}
                </div>
                 <div className="flex items-center gap-2 text-[9px] text-white/5 font-mono tracking-[0.3em] uppercase">
                    <Sparkles size={10} /> precision eng.
                 </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
          transition: all 0.5s ease;
        }
        .custom-nav-scroll::-webkit-scrollbar {
          width: 2px; 
        }
        .custom-nav-scroll::-webkit-scrollbar-thumb {
          background: var(--color-primary); 
          opacity: 0.2;
        }
      `}</style>
    </>
  );
}