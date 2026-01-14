"use client"
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github size={22} />, href: "https://github.com/momhamedga", label: "Github" },
    { icon: <Twitter size={22} />, href: "#", label: "Twitter" },
    { icon: <Linkedin size={22} />, href: "#", label: "LinkedIn" },
    { icon: <Instagram size={22} />, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="relative bg-transparent pt-32 pb-10 overflow-hidden" id="footer">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center">
          
          {/* 1. النص الضخم - CTA Section */}
          <div className="relative group cursor-default mb-32 w-full flex justify-center items-center">
            <motion.h2 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}
              className="text-[14vw] font-black text-transparent leading-none tracking-tighter text-center uppercase select-none group-hover:text-white/5 transition-colors duration-700"
            >
              لنتحدث <span className="group-hover:text-purple-600/20 transition-colors duration-700">معاً</span>
            </motion.h2>
            
            {/* الزر المغناطيسي المركزي */}
            <div className="absolute inset-0 flex items-center justify-center">
               <Magnetic>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-28 h-28 md:w-44 md:h-44 bg-white text-black rounded-full flex items-center justify-center group/btn cursor-pointer overflow-hidden relative shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-shadow duration-500"
                  >
                    <div className="absolute inset-0 bg-purple-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 rounded-full" />
                    <span className="relative z-10 font-black text-sm md:text-xl group-hover/btn:text-white transition-colors duration-500">
                      ابدأ الآن
                    </span>
                  </motion.div>
               </Magnetic>
            </div>
          </div>

          {/* 2. روابط التواصل الاجتماعي */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-32">
            {socialLinks.map((link, index) => (
              <Magnetic key={index}>
                <a 
                  href={link.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3"
                  aria-label={link.label}
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-purple-500/40 group-hover:bg-purple-500/10 transition-all duration-500 backdrop-blur-sm">
                    <span className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                      {link.icon}
                    </span>
                  </div>
                </a>
              </Magnetic>
            ))}
          </div>

          {/* 3. شريط الحقوق السفلي */}
          <div className="w-full pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gray-500 font-mono text-[10px] md:text-xs tracking-tighter text-center md:text-right">
              © {currentYear} <span className="text-white font-bold">MOJIMMY</span> — تـم تصمـيمه بـكود نـظيف وشغـف فـني.
            </div>
            
            <div className="flex items-center gap-3 px-5 py-2 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-md">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-gray-400 font-mono text-[9px] uppercase tracking-[0.2em]">متاح للعمل الحر 2026</span>
            </div>

            <div className="flex gap-8 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>

      {/* لمسة ديكورية نهائية بالأسفل */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </footer>
  );
}