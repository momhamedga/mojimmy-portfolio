"use client"
import { motion, Variants } from "framer-motion";

// 1. تعريف الـ Variants خارج المكون لتحسين الأداء (Static References)
const explosionVariants: Variants = {
  hover: { 
    scale: 1.8, 
    opacity: 0.8,
    transition: { duration: 0.6, ease: "easeOut" } 
  },
  tap: { 
    scale: 0.9, 
    opacity: 0.4 
  }
};

const containerVariants: Variants = {
  hover: { 
    scale: 1.05, 
    borderRadius: "1.25rem", // تم تقليل القيمة لتناسب شكل الـ Glassmorphism
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  tap: { 
    scale: 0.95, 
    borderRadius: "1rem" 
  }
};

const liquidVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    // تحسين قيم الـ Blob لتكون أخف في الحسابات
    borderRadius: [
      "30% 70% 70% 30% / 30% 30% 70% 70%",
      "50% 50% 30% 70% / 40% 70% 30% 60%",
      "30% 70% 70% 30% / 30% 30% 70% 70%"
    ],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const Logo = () => {
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="relative cursor-pointer group select-none"
    >
      {/* 1. تأثير الانفجار اللوني الخلفي (GPU Accelerated) */}
      <motion.div 
        variants={explosionVariants}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="absolute top-[-10%] right-[-10%] w-10 h-10 bg-blue-500 rounded-full blur-[25px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-10%] w-10 h-10 bg-pink-500 rounded-full blur-[25px] opacity-40" />
      </motion.div>
      
      {/* 2. حاوية المنشور الزجاجي */}
      <motion.div 
        variants={containerVariants}
        className="relative z-10 w-14 h-14 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 p-[1.5px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(168,85,247,0.2)]"
        style={{ willChange: "transform, border-radius" }}
      >
        {/* 3. النواة السائلة (The Core) */}
        <motion.div 
          variants={liquidVariants}
          animate="animate"
          className="absolute inset-0 bg-[#050505]/90 backdrop-blur-2xl overflow-hidden"
        >
          {/* أضواء متحركة داخلية */}
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-pink-500/10 animate-pulse delay-700 blur-2xl" />
        </motion.div>
        
        {/* 4. حرف M النيون */}
        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <motion.span 
            variants={{
              hover: { 
                scale: 1.1, 
                textShadow: "0 0 12px rgba(255,255,255,0.8), 0 0 20px rgba(168,85,247,0.5)" 
              }
            }}
            className="font-cairo text-2xl italic tracking-tighter text-white"
            style={{ textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
          >
            M
          </motion.span>
        </div>

        {/* تأثير الانعكاس الضوئي (Reflection Sweep) */}
        <motion.div 
          variants={{
            hover: { x: "250%" }
          }}
          initial={{ x: "-150%", skewX: -20 }}
          transition={{ duration: 0.75, ease: "circOut" }}
          className="absolute inset-0 z-30 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 h-full"
        />
      </motion.div>
    </motion.div>
  );
};