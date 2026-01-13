"use client"
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useRef } from "react";

export default function WhatsAppButton() {
  const ref = useRef<HTMLDivElement>(null);

  // إحداثيات الماوس للحركة المغناطيسية
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // تنعيم الحركة باستخدام Spring
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (ref.current) {
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      x.set(clientX - centerX);
      y.set(clientY - centerY);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    // أضفنا hidden md:block لإخفائه في الموبايل والتابلت
    <div className="fixed bottom-8 left-8 z-[999] group hidden md:block">
      
      {/* نص يظهر عند الهوفر */}
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute left-20 top-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-black uppercase tracking-tighter py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl pointer-events-none"
      >
        Let's Chat! ✨
      </motion.span>

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: mouseX, y: mouseY }}
        className="relative flex items-center justify-center w-16 h-16 cursor-pointer"
      >
        {/* حلقات النبض */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
        <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-40 scale-110" />

        {/* الزر الأساسي (بدون سهم Next) */}
        <a 
          href="https://wa.me/+971589915968" // رقمك هنا
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform duration-300 active:scale-90"
        >
          <MessageCircle className="text-white w-7 h-7 fill-white" />
        </a>
      </motion.div>
    </div>
  );
}