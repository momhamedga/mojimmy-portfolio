"use client"
import { motion, Variants } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, ArrowUpLeft } from "lucide-react";
import { SocialLink } from "./SocialLink"; // تأكد من تحديث الـ SocialLink أيضاً ليدعم TS
import Magnetic from "../Magnetic";
import Link from "next/link";
import { useCallback, useMemo } from "react";

// 1. تعريف البيانات خارج المكون (Static Data) لتقليل الـ Memory Footprint
interface SocialLinkItem {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const titleVariants: Variants = {
  initial: { y: 100, opacity: 0 },
  whileInView: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks: SocialLinkItem[] = useMemo(() => [
    { icon: <Github size={22} />, href: "https://github.com/momhamedga", label: "Github" },
    { icon: <Twitter size={22} />, href: "#", label: "Twitter" },
    { icon: <Linkedin size={22} />, href: "#", label: "LinkedIn" },
    { icon: <Instagram size={22} />, href: "#", label: "Instagram" },
  ], []);

  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (navigator.vibrate) navigator.vibrate(10);
    }
  }, []);

  const handleContactScroll = useCallback(() => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden selection:bg-purple-500/30 " id="footer" dir="rtl">
      
      {/* تأثيرات الإضاءة الخلفية (Optimized Layers) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center">
          
          {/* 1. قسم العنوان الضخم - Call To Action */}
          <div className="relative group w-full flex justify-center items-center py-20 md:py-32">
            <motion.div
              variants={titleVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="relative pointer-events-none"
            >
              <h2 
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.08)' }}
                className="text-[14vw] md:text-[10vw] font-cairo text-transparent leading-none tracking-tighter text-center uppercase select-none transition-colors duration-700 italic"
              >
                لنتحدث <span className="text-white/5 group-hover:text-purple-500/20 transition-colors duration-700">بشغف</span>
              </h2>
            </motion.div>
            
            {/* الزر المركزي "ابدأ الآن" */}
            <div className="absolute inset-0 flex items-center justify-center">
               <Magnetic>
                  <motion.button 
                    onClick={handleContactScroll}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-32 h-32 md:w-52 md:h-52 bg-white text-black rounded-full flex items-center justify-center group/btn cursor-pointer overflow-hidden relative shadow-[0_0_50px_rgba(255,255,255,0.05)] outline-none"
                  >
                    <div className="absolute inset-0 bg-purple-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 rounded-full" />
                    <div className="relative z-10 flex flex-col items-center gap-1 pointer-events-none">
                        <span className="font-black text-sm md:text-2xl group-hover/btn:text-white transition-colors duration-500">ابدأ الآن</span>
                        <ArrowUpLeft size={20} className="group-hover/btn:text-white group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-all duration-500" />
                    </div>
                  </motion.button>
               </Magnetic>
            </div>
          </div>

          {/* 2. روابط التواصل الاجتماعي */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-24 md:mb-32">
            {socialLinks.map((link) => (
              <SocialLink key={link.label} link={link} />
            ))}
          </div>

          {/* 3. شريط الحقوق السفلي */}
          <div className="w-full pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* الحقوق */}
            <div className="order-2 md:order-1 flex flex-col items-center md:items-start gap-2">
              <p className="text-gray-500 text-xs md:text-sm text-center md:text-right">
                © {currentYear} <span className="text-white font-cairo tracking-widest">MOJIMMY</span>
              </p>
              <p className="text-[10px] text-gray-600 uppercase tracking-[3px]">
                صُنع يدويًا بأحدث التقنيات الرقمية
              </p>
            </div>

            {/* حالة العمل (Availability) */}
            <div className="order-1 md:order-2">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-3 px-6 py-2.5 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-xl shadow-inner cursor-default"
                >
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                    </div>
                    <span className="text-gray-300 text-[11px] font-cairo tracking-wide">متاح لمشاريع جديدة 2026</span>
                </motion.div>
            </div>

            {/* الروابط الفرعية وزر الصعود */}
            <div className="order-3 flex items-center gap-8">
              <div className="hidden sm:flex gap-6 text-[10px] font-cairo text-gray-600 uppercase tracking-[0.2em]">
                <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms</Link>
              </div>
              
              <Magnetic>
                <button 
                  onClick={scrollToTop}
                  aria-label="Scroll to top"
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all group active:scale-90"
                >
                  <ArrowUpLeft className="rotate-45 group-hover:-translate-y-1 transition-transform" size={20} />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}