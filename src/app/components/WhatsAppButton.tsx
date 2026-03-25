"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useRef, useState } from "react";

export default function WhatsAppButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion Values لسلاسة الحركة
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // حركة مغناطيسية ناعمة جداً
  const mouseX = useSpring(x, { stiffness: 60, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 60, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2); // تقليل قوة الجذب لشكل أرقى
    y.set((e.clientY - centerY) * 0.2);
  };

  return (
    <div className="fixed bottom-8 left-8 z-[1000] hidden md:block group">
      {/* 1. التلميح (Tooltip) - فوق الزرار مباشرة */}
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={isHovered ? { opacity: 1, y: -70, scale: 1 } : { opacity: 0, y: 10, scale: 0.9 }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-white text-[12px] font-cairo font-medium whitespace-nowrap">
            تواصل معنا
          </span>
        </div>
        {/* سهم صغير أسفل الـ Tooltip */}
        <div className="w-2 h-2 bg-white/10 backdrop-blur-md border-r border-b border-white/20 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
      </motion.div>

      {/* 2. حاوية الزرار */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); x.set(0); y.set(0); }}
        style={{ x: mouseX, y: mouseY }}
        className="relative w-20 h-20 flex items-center justify-center cursor-pointer"
      >
        {/* خلفية متوهجة (Soft Glow) */}
        <motion.div 
          animate={isHovered ? { scale: 1.5, opacity: 0.2 } : { scale: 1, opacity: 0.1 }}
          className="absolute inset-4 bg-[#25D366] rounded-full blur-[30px] transition-all duration-700"
        />

        {/* الزر الدائري الفخم */}
        <motion.a 
          href="https://wa.me/+971589915968"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-14 h-14 bg-gradient-to-tr from-[#128C7E] to-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.3)] border border-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* انعكاس ضوئي (Glossy Look) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none" />
          
          <MessageCircle className="text-white w-7 h-7 fill-white/10" />
        </motion.a>
      </motion.div>
    </div>
  );
}