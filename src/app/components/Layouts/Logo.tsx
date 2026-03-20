"use client"
import { motion } from "framer-motion";

export const Logo = () => (
  <motion.div 
    whileHover="hover"
    whileTap="tap"
    className="relative cursor-pointer group"
  >
    {/* 1. تأثير "الانفجار اللوني" الخلفي (Color Explosion) */}
    {/* هذه الدوائر هي ألوان الهوية: الأزرق، البنفسجي، الوردي */}
    <motion.div 
      variants={{
        hover: { scale: 1.8, opacity: 0.8 },
        tap: { scale: 0.8, opacity: 0.2 }
      }}
      className="absolute inset-0 z-0 transition-all duration-1000"
    >
      <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500 rounded-full blur-2xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-pink-500 rounded-full blur-2xl opacity-60" />
    </motion.div>
    
    {/* 2. حاوية المنشور الزجاجي السائل */}
    <motion.div 
      variants={{
        hover: { scale: 1.05, borderRadius: "2rem" },
        tap: { scale: 0.95, borderRadius: "1.2rem" }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative z-10 w-14 h-14 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 p-[1.5px] rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(168,85,247,0.3)]"
    >
      {/* 3. تأثير "السائل الجوهري" الداخلي (The Liquid Core) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-black/80 rounded-3xl backdrop-blur-3xl overflow-hidden"
      >
        {/* أضواء سائلة متحركة داخل الصندوق الأسود */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-400 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-pink-400 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
      </motion.div>
      
      {/* 4. حرف M بتأثير الـ Neon المشع */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        <motion.span 
          variants={{
            hover: { scale: 1.15, textShadow: "0 0 15px #fff, 0 0 20px #a855f7" }
          }}
          className="font-black text-3xl italic tracking-tighter text-white transition-all duration-500"
          style={{
             textShadow: "0 0 5px #fff" // توهج نيون خفيف افتراضي
          }}
        >
          M
        </motion.span>
      </div>

      {/* لمسة إبداعية: انعكاس ضوئي مائل يمر عند الاختيار */}
      {/* يتوافق مع حركة الـ Swipe في الموبايل */}
      <motion.div 
        variants={{
           hover: { x: "200%" }
        }}
        initial={{ x: "-200%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 z-30 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -skew-x-12"
      />
    </motion.div>
  </motion.div>
);