"use client"
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, ArrowUpLeft } from "lucide-react";
import { SocialLink } from "./SocialLink";
import Magnetic from "../Magnetic";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github size={22} />, href: "https://github.com/momhamedga", label: "Github" },
    { icon: <Twitter size={22} />, href: "#", label: "Twitter" },
    { icon: <Linkedin size={22} />, href: "#", label: "LinkedIn" },
    { icon: <Instagram size={22} />, href: "#", label: "Instagram" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  return (
    <footer className="relative  pt-20 pb-10 overflow-hidden selection:bg-purple-500/30" id="footer" dir="rtl">
      
      {/* تأثيرات الإضاءة الخلفية */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center">
          
          {/* 1. قسم العنوان الضخم - Call To Action */}
          <div className="relative group w-full flex justify-center items-center py-20 md:py-32">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <h2 
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.08)' }}
                className="text-[16vw] md:text-[12vw] font-black text-transparent leading-none tracking-tighter text-center uppercase select-none transition-colors duration-700 font-arabic italic"
              >
                لنتحدث <span className="text-white/5 group-hover:text-purple-500/20 transition-colors duration-700 italic">بشغف</span>
              </h2>
            </motion.div>
            
            {/* الزر المركزي "ابدأ الآن" */}
            <div className="absolute inset-0 flex items-center justify-center">
               <Magnetic>
                  <motion.div 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-32 h-32 md:w-52 md:h-52 bg-white text-black rounded-full flex items-center justify-center group/btn cursor-pointer overflow-hidden relative shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                  >
                    <div className="absolute inset-0 bg-purple-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 rounded-full" />
                    <div className="relative z-10 flex flex-col items-center gap-1">
                        <span className="font-black text-sm md:text-2xl group-hover/btn:text-white transition-colors duration-500 font-arabic">ابدأ الآن</span>
                        <ArrowUpLeft size={20} className="group-hover/btn:text-white group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-all duration-500" />
                    </div>
                  </motion.div>
               </Magnetic>
            </div>
          </div>

          {/* 2. روابط التواصل الاجتماعي بتصميم شبكي للموبايل */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-24 md:mb-32">
            {socialLinks.map((link, index) => (
              <SocialLink key={index} link={link} />
            ))}
          </div>

          {/* 3. شريط الحقوق السفلي (تجاوب كامل) */}
          <div className="w-full pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* الجهة اليمنى: الحقوق */}
            <div className="order-2 md:order-1 flex flex-col items-center md:items-start gap-2">
              <p className="text-gray-500 font-arabic text-xs md:text-sm text-center md:text-right">
                © {currentYear} <span className="text-white font-bold tracking-widest">MOJIMMY</span>
              </p>
              <p className="text-[10px] text-gray-600 font-arabic uppercase tracking-[3px]">
                صُنع يدويًا بأحدث التقنيات الرقمية
              </p>
            </div>

            {/* الوسط: حالة العمل */}
            <div className="order-1 md:order-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 px-6 py-2.5 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-xl shadow-inner"
                >
                    <div className="relative">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    </div>
                    <span className="text-gray-300 font-arabic text-[11px] font-bold tracking-wide">متاح لمشاريع جديدة 2026</span>
                </motion.div>
            </div>

            {/* الجهة اليسرى: روابط فرعية وزر الصعود */}
            <div className="order-3 flex items-center gap-8">
               <div className="flex gap-6 text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] hidden sm:flex">
                <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
              </div>
              
              <Magnetic>
                <button 
                  onClick={scrollToTop}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all group"
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