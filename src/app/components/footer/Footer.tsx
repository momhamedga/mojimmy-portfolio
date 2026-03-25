"use client"
import { motion, Variants } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, ArrowUpLeft, Globe, Clock } from "lucide-react";
import Magnetic from "../Magnetic";
import Link from "next/link";
import { useCallback, useMemo, useEffect, useRef } from "react";

const titleVariants: Variants = {
  initial: { y: 100, opacity: 0 },
  whileInView: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  // استخدام Ref للوصول المباشر للعنصر في الـ DOM
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
      
      // تحديث النص مباشرة بدون Re-render
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
    { icon: <Instagram size={20} />, href: "#", label: "إنستغرام" },
  ], []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (navigator.vibrate) navigator.vibrate(15);
  }, []);

  return (
    <footer className="relative pt-32 pb-12 overflow-hidden bg-transparent" id="footer" dir="rtl">
      
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Giant Dynamic Text */}
        <div className="relative flex justify-center items-center py-20 md:py-32 border-b border-white/[0.03]">
          <motion.div
            variants={titleVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="w-full"
          >
            <h2 className="text-[14vw] md:text-[10vw] font-cairo text-white opacity-5 leading-none tracking-tighter text-center uppercase italic font-black select-none pointer-events-none">
               مو جيمي ستوديو
            </h2>
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Magnetic>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative w-40 h-40 md:w-56 md:h-56 bg-white text-black rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.1)] transition-all duration-700 active:scale-90 overflow-hidden"
              >
                <div className="absolute inset-0 bg-purple-600 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="font-black text-xl md:text-3xl font-cairo group-hover:text-white transition-colors">لنتعاون؟</span>
                  <ArrowUpLeft size={28} className="group-hover:text-white group-hover:-translate-y-2 group-hover:translate-x-2 transition-all duration-500 rotate-180" />
                </div>
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Footer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 items-center">
          
          {/* Live Location & Time - REF USED HERE */}
          <div className="flex flex-col items-center md:items-start gap-4 order-2 md:order-1">
             <div className="flex items-center gap-3 text-gray-500 font-cairo text-sm">
                <Globe size={16} className="text-purple-500" />
                <span>أبوظبي، الإمارات العربية المتحدة</span>
             </div>
             <div className="flex items-center gap-3 text-white font-black font-cairo text-2xl tracking-tighter">
                <Clock size={18} className="text-blue-400" />
                {/* العنصر الذي يتم تحديثه عبر Ref */}
                <span ref={timeRef} suppressHydrationWarning className="tabular-nums">--:--:-- --</span>
             </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-4 order-1 md:order-2">
            {socialLinks.map((link) => (
              <Magnetic key={link.label}>
                <Link href={link.href} className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 transition-all shadow-xl">
                   {link.icon}
                </Link>
              </Magnetic>
            ))}
          </div>

          {/* Version & Status */}
          <div className="flex flex-col items-center md:items-end gap-4 order-3">
             <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">متاح للمشاريع الجديدة</span>
             </div>
             <div className="text-gray-600 text-[10px] font-medium tracking-[4px] uppercase font-cairo">
                الإصدار 1.4.0 — {currentYear}
             </div>
          </div>
        </div>

        {/* Centered Back to Top */}
        <div className="pt-10 border-t border-white/[0.03] flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-4">
            <Magnetic>
              <button 
                onClick={scrollToTop}
                className="flex flex-col items-center gap-4 text-white/40 hover:text-white transition-all group"
              >
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shadow-2xl relative">
                   <ArrowUpLeft className="rotate-45 group-hover:-translate-y-1 transition-transform" size={20} />
                   <span className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-0 group-hover:opacity-100" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] font-cairo">العودة للقمة</span>
              </button>
            </Magnetic>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
            <p className="text-gray-600 text-[11px] font-cairo uppercase tracking-widest">
              © {currentYear} مو جيمي — جميع الحقوق محفوظة
            </p>
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest font-cairo text-gray-600">
              <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}