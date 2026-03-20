"use client"
import { motion } from "framer-motion";
import Magnetic from "../Magnetic";


interface SocialLinkProps {
link: { icon: React.ReactNode; href: string; label: string };
}

export const SocialLink = ({ link }: SocialLinkProps) => {
  const handleTouch = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(5);
  };

  return (
    <Magnetic>
      <motion.a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onTouchStart={handleTouch}
        whileTap={{ scale: 0.9 }}
        className="group relative"
        aria-label={link.label}
      >
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-500 backdrop-blur-md overflow-hidden">
          {/* تأثير الـ Hover الضوئي */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <span className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-500 relative z-10">
            {link.icon}
          </span>
        </div>
        
        {/* اسم المنصة يظهر تحتها في الشاشات الكبيرة */}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity font-mono uppercase tracking-widest hidden md:block">
          {link.label}
        </span>
      </motion.a>
    </Magnetic>
  );
};