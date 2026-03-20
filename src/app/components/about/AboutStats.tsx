"use client"
import { motion, MotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function AboutStats({ progress }: { progress: MotionValue<number> }) {
  // 1. تنعيم حركة الشريط للموبايل لتبدو "Organic"
  const smoothWidth = useSpring(useTransform(progress, [0, 0.7], ["0%", "99%"]), {
    stiffness: 50,
    damping: 20
  });

  // 2. ربط النسبة المئوية كنص يتغير مع السكرول
  const [percent, setPercent] = useState(0);
  const percentage = useTransform(progress, [0, 0.7], [0, 99]);

  useEffect(() => {
    // تحديث الرقم في الواجهة عند السكرول
    return percentage.onChange((v) => setPercent(Math.round(v)));
  }, [percentage]);

  return (
    <div className="pt-8 md:pt-10 space-y-5 border-t border-white/5 w-full max-w-xs group" dir="rtl">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-purple-400 font-mono text-[9px] uppercase tracking-[0.2em] block">
            Technical Mastery
          </span>
          <span className="text-gray-400 text-xs font-medium">الإتقان التقني</span>
        </div>
        
        {/* العداد الرقمي التفاعلي */}
        <div className="flex items-baseline gap-0.5">
          <motion.span className="text-white font-black text-3xl md:text-4xl italic tracking-tighter">
            {percent}
          </motion.span>
          <span className="text-purple-500 font-bold text-sm">%</span>
        </div>
      </div>
      
      {/* شريط التقدم بتصميم نيون (Neon Glow) */}
      <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden relative">
        {/* توهج خلفي (Glow) يظهر على شاشات الموبايل القوية */}
        <motion.div 
          style={{ width: smoothWidth }}
          className="absolute inset-0 bg-purple-500/20 blur-sm"
        />
        
        <motion.div 
          style={{ width: smoothWidth }}
          className="h-full bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500 relative z-10" 
        />
      </div>
      
      {/* نصوص توضيحية بنظام الـ Micro-interactions */}
      <div className="flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
        <p className="text-[8px] md:text-[9px] text-gray-500 font-medium tracking-wide uppercase">
          Build . Scale . Optimize
        </p>
        <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
                <div key={i} className={`w-1 h-1 rounded-full ${percent > (i * 30) ? 'bg-purple-500' : 'bg-white/10'}`} />
            ))}
        </div>
      </div>
    </div>
  );
}