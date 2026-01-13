"use client"
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github size={22} />, href: "#", label: "Github" },
    { icon: <Twitter size={22} />, href: "#", label: "Twitter" },
    { icon: <Linkedin size={22} />, href: "#", label: "LinkedIn" },
    { icon: <Instagram size={22} />, href: "#", label: "Instagram" },
  ];

  return (
    // تم تحويل الخلفية لشفافة لتتناغم مع الـ Unified Background
    <footer className="relative bg-transparent pt-32 pb-10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          
          {/* النص الضخم المتفاعل - Massive Call to Action */}
          <div className="relative group cursor-default mb-32">
            <motion.h2 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[14vw] font-black text-white/5 leading-none tracking-tighter text-center uppercase select-none group-hover:text-white transition-colors duration-700"
            >
              لنتحدث <span className="group-hover:text-purple-600 transition-colors duration-700">معاً</span>
            </motion.h2>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <Magnetic>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-24 h-24 md:w-40 md:h-40 bg-white text-black rounded-full flex items-center justify-center group/btn cursor-pointer overflow-hidden relative shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-purple-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 rounded-full" />
                    <span className="relative z-10 font-black text-sm md:text-xl group-hover/btn:text-white transition-colors duration-500">
                      ابدأ الآن
                    </span>
                  </motion.div>
               </Magnetic>
            </div>
          </div>

          {/* روابط التواصل */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-32">
            {socialLinks.map((link, index) => (
              <Magnetic key={index}>
                <a 
                  href={link.href} 
                  className="group flex flex-col items-center gap-3"
                  aria-label={link.label}
                >
                  <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-500">
                    <span className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-500 block">
                      {link.icon}
                    </span>
                  </div>
                </a>
              </Magnetic>
            ))}
          </div>

          {/* الجزء السفلي - Bottom Bar */}
          <div className="w-full pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gray-500 font-mono text-xs tracking-tighter">
              © {currentYear} <span className="text-white font-bold">MOJIMMY</span> — تـم تصمـيمه   بواسطة  
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                <span className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em]">متاح للمشاريع الجديدة</span>
            </div>

            <div className="flex gap-8 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}