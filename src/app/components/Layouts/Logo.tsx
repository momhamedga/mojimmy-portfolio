"use client"
import { motion, Variants } from "framer-motion";
import { memo } from "react";

// 1. تحسين الـ Variants لضمان سلاسة الـ GPU
const explosionVariants: Variants = {
  hover: { 
    scale: 2.5, 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  },
  tap: { scale: 0.9, opacity: 0.5 }
};

const containerVariants: Variants = {
  hover: { 
    scale: 1.1, 
    rotate: [0, -1, 1, 0],
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 15,
      rotate: { duration: 0.5, repeat: Infinity }
    }
  },
  tap: { scale: 0.92 }
};

export const Logo = memo(() => {
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="relative cursor-pointer group select-none touch-none w-fit h-fit"
    >
      {/* 1. Aura Blast - هالة النيون المحيطة */}
      <motion.div 
        variants={explosionVariants}
        className="absolute inset-[-30%] z-0 pointer-events-none opacity-0 blur-2xl"
        style={{ 
          background: "radial-gradient(circle, oklch(0.7 0.25 260 / 0.2) 0%, transparent 70%)",
          willChange: "transform, opacity" 
        }}
      />
      
      {/* 2. الإطار المنشوري (The Prism Border) */}
      <motion.div 
        variants={containerVariants}
        className="relative z-10 w-14 h-14 p-[1.5px] rounded-[1.3rem] overflow-hidden "
        style={{ 
          background: "linear-gradient(135deg, oklch(0.8 0.2 260), oklch(0.5 0.3 300), oklch(0.8 0.2 340))",
          willChange: "transform"
        }}
      >
        {/* 3. النواة السائلة (The Core) */}
        <div className="relative w-full h-full bg-background rounded-[1.25rem] overflow-hidden">
          
          {/* Scanline Noise Texture */}
          <div className="absolute inset-0 z-10 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {/* Liquid Light Shimmer */}
          <motion.div 
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              x: ["-20%", "20%"],
              y: ["-20%", "20%"]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-50%] z-0"
            style={{
              background: "radial-gradient(circle at center, oklch(0.6 0.2 260 / 0.15), transparent 60%)"
            }}
          />

          {/* 4. حرف M المحفور (Etched Glass Effect) */}
          <div className="relative z-20 w-full h-full flex items-center justify-center">
            <motion.span 
              variants={{
                hover: { 
                  scale: 1.2,
                  filter: "drop-shadow(0 0 15px oklch(0.8 0.15 260 / 0.6))"
                }
              }}
              className="font-cairo text-[26px] font-black italic text-white tracking-tighter"
              style={{ 
                WebkitTextStroke: "0.5px oklch(1 0 0 / 0.4)",
                textShadow: "0 4px 10px rgba(0,0,0,0.5)"
              }}
            >
              M
            </motion.span>
          </div>

          {/* 5. الـ Reflection Shimmer (اللمعة الأوتوماتيكية) */}
          <motion.div 
            animate={{ x: ["-150%", "300%"] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatDelay: 4, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="absolute inset-0 z-30 w-[80%] h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-[-30deg]"
          />
        </div>
      </motion.div>

      {/* 6. Active Beacon (نقطة النشاط أسفل اللوجو) */}
      <motion.div 
        animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.3, 0.8] 
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <div className="w-[3px] h-[3px] bg-white rounded-full blur-[0.5px] shadow-[0_0_8px_white]" />
      </motion.div>
    </motion.div>
  );
});

Logo.displayName = "Logo";