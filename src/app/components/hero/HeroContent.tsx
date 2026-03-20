"use client"
import { motion } from "framer-motion";

export const HeroContent = () => {
  return (
    <div className="space-y-6">
      {/* Badge علوي مودرن */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-xl"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
        </span>
        <span className="text-gray-300 font-mono text-[10px] uppercase tracking-[0.2em]">متاح للمشاريع الجديدة</span>
      </motion.div>

      {/* العنوان الرئيسي - تدرج لوني سينمائي */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter"
      >
        نصنع واقعاً <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 animate-gradient-x">
          رقمياً مذهلاً.
        </span>
      </motion.h1>

      {/* النص الفرعي - وضوح عالي للموبايل */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-2xl mx-auto text-gray-400 text-sm md:text-xl leading-relaxed px-4"
      >
        نحول الأفكار المعقدة إلى واجهات تفاعلية بسيطة. متخصصون في بناء تجارب مستخدم تترك أثراً لا ينسى.
      </motion.p>
    </div>
  );
};