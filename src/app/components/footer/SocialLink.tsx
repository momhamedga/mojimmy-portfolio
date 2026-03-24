"use client"
import { motion } from "framer-motion";
import Magnetic from "../Magnetic";
import { memo } from "react"; // لتحسين الأداء ومنع الـ Re-renders غير الضرورية

interface SocialLinkProps {
  link: { icon: React.ReactNode; href: string; label: string };
}

// استخدام memo لأن الروابط ثابتة ولا تحتاج لإعادة بناء كل مرة
export const SocialLink = memo(({ link }: SocialLinkProps) => {
  
  const handleTouch = () => {
    // اهتزاز خفيف جداً يعطي إحساس بالفخامة عند اللمس في الموبايل
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(8); 
    }
  };

  return (
    <Magnetic intensity={0.2}> {/* إضافة شدة للمغناطيس لو المكون بيدعمها */}
      <motion.a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onTouchStart={handleTouch}
        whileHover={{ y: -5 }} // حركة بسيطة للأعلى عند الهوفر
        whileTap={{ scale: 0.92, rotate: -2 }} // تأثير ضغطة احترافي
        className="group relative block"
        aria-label={link.label}
      >
        {/* الحاوية الأساسية مع تأثير الـ Glassmorphism */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:border-purple-500/40 group-hover:bg-purple-500/5 transition-all duration-500 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
          
          {/* طبقة الإضاءة الديناميكية (Inner Glow) */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* الأيقونة */}
          <span className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-500 relative z-10 filter group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
            {link.icon}
          </span>

          {/* تأثير الـ Flare اللحظي عند الهوفر */}
          <div className="absolute -inset-full h-full w-1/2 z-5 block transform -rotate-45 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:animate-shine" />
        </div>
        
        {/* Label (Mobile: Hidden | Desktop: Elegant reveal) */}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] text-purple-400/0 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-500 font-cairo uppercase tracking-[0.3em] font-black whitespace-nowrap hidden md:block">
          {link.label}
        </span>
      </motion.a>
    </Magnetic>
  );
});

SocialLink.displayName = "SocialLink";