"use client"
import { motion } from "framer-motion";
import Magnetic from "../Magnetic";
import { memo } from "react";
import { cn } from "@/src/lib/utils";

interface SocialLinkProps {
  link: { 
    icon: React.ReactNode; 
    href: string; 
    label: string 
  };
}

export const SocialLink = memo(({ link }: SocialLinkProps) => {
  
  const handleTouch = () => {
    // اهتزاز ميكروسكوبي - يعطي شعور بالفخامة عند اللمس
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
        whileHover={{ y: -8 }} 
        whileTap={{ scale: 0.9, rotate: -3 }}
        className="group relative block"
        aria-label={link.label}
      >
        {/* Main Glass Container */}
        <div className={cn(
          "w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem]",
          "bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl",
          "flex items-center justify-center transition-all duration-500",
          "group-hover:border-purple-500/40 group-hover:bg-purple-500/5",
          "relative overflow-hidden shadow-2xl shadow-black/50"
        )}>
          
          {/* Reactive Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* The Icon - Cinematic Glow */}
          <span className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-500 relative z-10 filter group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">
            {link.icon}
          </span>

          {/* Animated Flare (The Shine) */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -rotate-45 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent opacity-0 group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
        </div>
        
        {/* Dynamic Label - Scanned Typography */}
        <span className={cn(
          "absolute -bottom-10 left-1/2 -translate-x-1/2",
          "text-[9px] font-black font-cairo uppercase tracking-[0.4em] whitespace-nowrap",
          "text-purple-400 opacity-0 translate-y-2",
          "group-hover:opacity-100 group-hover:translate-y-0",
          "transition-all duration-500 pointer-events-none hidden md:block"
        )}>
          {link.label}
        </span>
      </motion.a>
    </Magnetic>
  );
});

SocialLink.displayName = "SocialLink";