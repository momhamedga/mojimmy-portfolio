"use client"
import { motion, Variants } from "framer-motion";

// 1. Variants محسنة للأداء العالي (GPU Optimized)
const explosionVariants: Variants = {
  hover: { 
    scale: 2, 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  },
  tap: { scale: 0.9, opacity: 0.5 }
};

const containerVariants: Variants = {
  hover: { 
    scale: 1.08, 
    transition: { type: "spring", stiffness: 400, damping: 20 }
  },
  tap: { scale: 0.95 }
};

export const Logo = () => {
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="relative cursor-pointer group select-none touch-none"
    >
      {/* 1. Aura Blast باستخدام OKLCH لنقاء لوني فائق */}
      <motion.div 
        variants={explosionVariants}
        className="absolute inset-[-20%] z-0 pointer-events-none opacity-0"
        style={{ 
          background: "radial-gradient(circle, oklch(0.7 0.2 250 / 0.15) 0%, transparent 70%)",
          willChange: "transform, opacity" 
        }}
      />
      
      {/* 2. حاوية المنشور الزجاجي (The Prism) */}
      <motion.div 
        variants={containerVariants}
        className="relative z-10 w-14 h-14 p-[1px] rounded-[1.25rem] overflow-hidden shadow-2xl"
        style={{ 
          background: "linear-gradient(135deg, oklch(0.7 0.2 250), oklch(0.6 0.2 300), oklch(0.7 0.2 350))",
          willChange: "transform"
        }}
      >
        {/* 3. النواة السائلة (The Core) مع Noise Texture */}
        <div className="relative w-full h-full bg-[#080809] rounded-[1.2rem] overflow-hidden">
          
          {/* تأثير الـ Scanline Noise (التريند السينمائي 2026) */}
          <div className="absolute inset-0 z-10 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {/* إضاءات Radial متحركة بديلة للـ Blur المكثف (GPU Friendly) */}
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
            style={{
              background: "radial-gradient(circle at 20% 20%, oklch(0.6 0.2 250 / 0.2), transparent 50%)"
            }}
          />

          {/* 4. حرف M الزجاجي (Glass Etched) */}
          <div className="relative z-20 w-full h-full flex items-center justify-center">
            <motion.span 
              variants={{
                hover: { 
                  scale: 1.15,
                  filter: "drop-shadow(0 0 10px oklch(0.8 0.1 250 / 0.5))"
                }
              }}
              className="font-cairo text-2xl font-black italic text-white tracking-tighter"
              style={{ 
                WebkitTextStroke: "0.5px oklch(1 0 0 / 0.3)",
                textShadow: "0 0 15px oklch(1 0 0 / 0.2)"
              }}
            >
              M
            </motion.span>
          </div>

          {/* 5. الـ Reflection Loop (لمعة أوتوماتيكية كل 3 ثواني) */}
          <motion.div 
            animate={{ x: ["-150%", "300%"] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              repeatDelay: 3, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 z-30 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg]"
          />
        </div>
      </motion.div>

      {/* نقطة النشاط الذكية (Active Status) */}
      <motion.div 
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full blur-[1px]"
      />
    </motion.div>
  );
};