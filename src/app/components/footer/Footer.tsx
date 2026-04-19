"use client"
import { motion, Variants } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, ArrowUpLeft, Globe, Clock } from "lucide-react";
import Magnetic from "../Magnetic";
import Link from "next/link";
import { useCallback, useMemo, useEffect, useRef, memo } from "react";
import { cn } from "@/src/lib/utils";

const titleVariants: Variants = {
  initial: { y: 100, opacity: 0 },
  whileInView: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

// مكون الروابط الاجتماعية المطور
const SocialLink = memo(({ link }: { link: any }) => {
  const handleTouch = () => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(8); 
    }
  };

  return (
    <Magnetic>
      <motion.a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onTouchStart={handleTouch}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.92, rotate: -2 }}
        className="group relative block"
        aria-label={link.label}
      >
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <span className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-500 relative z-10 filter group-hover:drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]">
            {link.icon}
          </span>
          {/* Shine Animation Effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -rotate-45 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
        </div>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 font-cairo uppercase tracking-[0.3em] font-black whitespace-nowrap hidden md:block">
          {link.label}
        </span>
      </motion.a>
    </Magnetic>
  );
});

SocialLink.displayName = "SocialLink";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const uaeTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(new Date());
      
      if (timeRef.current) {
        timeRef.current.textContent = uaeTime;
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const socialLinks = useMemo(() => [
    { icon: <Github size={20} />, href: "https://github.com/momhamedga", label: "جيت هاب" },
    { icon: <Twitter size={20} />, href: "#", label: "تويتر" },
    { icon: <Linkedin size={20} />, href: "#", label: "لينكد إن" },
    { icon: <Instagram size={20} />, href: "#", label: "إنستجرام" },
  ], []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(15);
    }
  }, []);

  return (
    <footer className="relative pt-32 pb-12 overflow-hidden " id="footer" dir="rtl">
      
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Giant Dynamic Text Section */}
        <div className="relative flex justify-center items-center py-20 md:py-40 border-b border-white/[0.03]">
          <motion.div
            variants={titleVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="w-full"
          >
            <h2 className="text-[14vw] md:text-[10vw] font-cairo text-white opacity-[0.03] leading-none tracking-tighter text-center uppercase italic font-black select-none pointer-events-none">
                مو جيمي ستوديو
            </h2>
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Magnetic>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative w-44 h-44 md:w-64 md:h-64 bg-white text-black rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.1)] transition-all duration-700 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <span className="font-black text-2xl md:text-4xl font-cairo group-hover:text-black transition-colors">لنتعاون؟</span>
                  <ArrowUpLeft size={32} className="group-hover:text-black group-hover:-translate-y-2 group-hover:translate-x-2 transition-all duration-500 rotate-180" />
                </div>
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Footer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-20 items-center">
          
          {/* Live Location & Time */}
          <div className="flex flex-col items-center md:items-start gap-4 order-2 md:order-1">
             <div className="flex items-center gap-3 text-gray-500 font-cairo text-sm">
                <Globe size={16} className="text-primary animate-spin-slow" />
                <span>أبوظبي، الإمارات العربية المتحدة</span>
             </div>
             <div className="flex items-center gap-3 text-white font-black font-cairo text-2xl tracking-tighter">
                <Clock size={18} className="text-accent" />
                <span ref={timeRef} suppressHydrationWarning className="tabular-nums">--:--:-- --</span>
             </div>
          </div>

          {/* Social Links (Memoized) */}
          <div className="flex justify-center items-center gap-4 order-1 md:order-2">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} link={link} />
            ))}
          </div>

          {/* Version & Status */}
          <div className="flex flex-col items-center md:items-end gap-4 order-3">
             <div className="px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inset-0 rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">متاح للمشاريع الكبرى</span>
             </div>
        
          </div>
        </div>

        {/* Bottom Bar & Scroll to Top */}
        <div className="pt-10 border-t border-white/[0.03] flex flex-col items-center gap-12">
          <Magnetic>
            <button 
              onClick={scrollToTop}
              className="flex flex-col items-center gap-4 text-white/30 hover:text-white transition-all group"
            >
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shadow-2xl relative overflow-hidden">
                 <ArrowUpLeft className="rotate-45 group-hover:-translate-y-1 transition-transform" size={24} />
                 <span className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-0 group-hover:opacity-100" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] font-cairo">العودة للقمة</span>
            </button>
          </Magnetic>

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
            <p className="text-gray-500 text-[11px] font-cairo uppercase tracking-[0.2em]">
              © {currentYear} مو جيمي — جميع الحقوق محفوظة
            </p>
      
          </div>
        </div>
      </div>
    </footer>
  );
}