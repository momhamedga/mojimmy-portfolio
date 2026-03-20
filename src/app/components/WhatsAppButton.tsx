"use client"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { useRef, useState, useMemo } from "react";

export default function WhatsAppButton() {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // إحداثيات الماوس للحركة المغناطيسية
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 60, damping: 12 });
  const mouseY = useSpring(y, { stiffness: 60, damping: 12 });

  const rotateX = useTransform(mouseY, [-50, 50], [15, -15]);
  const rotateY = useTransform(mouseX, [-50, 50], [-15, 15]);

  // الحل الجذري: توليد أماكن الجزيئات مرة واحدة فقط لضمان الـ Purity
  const particles = useMemo(() => [
    { id: 1, angle: 0, distance: 45, size: 4, duration: 3 },
    { id: 2, angle: 120, distance: 50, size: 2, duration: 4 },
    { id: 3, angle: 240, distance: 40, size: 3, duration: 2.5 },
  ], []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (ref.current) {
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const moveX = (clientX - (left + width / 2)) * 0.4;
      const moveY = (clientY - (top + height / 2)) * 0.4;
      x.set(moveX);
      y.set(moveY);
    }
  };

  return (
    <div className="fixed bottom-10 left-10 z-[999] hidden md:block">
      {/* سحابة نصية محسنة */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={isHovered ? { opacity: 1, scale: 1, x: 100 } : { opacity: 0, scale: 0.8, x: 20 }}
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-[1000]"
      >
        <div className="bg-black/80 backdrop-blur-xl border border-green-500/30 text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 px-6 rounded-2xl rounded-bl-none shadow-[0_0_30px_rgba(34,197,94,0.2)] flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Support
        </div>
      </motion.div>

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
        style={{ x: mouseX, y: mouseY, rotateX, rotateY, perspective: 1000 }}
        className="relative flex items-center justify-center w-28 h-28 cursor-pointer"
      >
        {/* هالة النيون الخلفية */}
        <motion.div 
          animate={{ scale: isHovered ? 1.6 : 1, opacity: isHovered ? 0.4 : 0.15 }}
          className="absolute inset-4 bg-green-500 rounded-full blur-[40px] transition-colors duration-500" 
        />

        {/* حلقات النبض */}
        <div className="absolute inset-8 bg-green-500 rounded-full animate-ping opacity-10" />
        
        {/* الزر الأساسي */}
        <motion.a 
          href="https://wa.me/+971589915968"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="relative z-10 w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
        >
          {/* Shine Effect المطور */}
          <motion.div 
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg]"
          />
          <MessageCircle className="text-white w-8 h-8 fill-white" />
        </motion.a>

        {/* جزيئات النيون - الآن بحركة مدارية دائرية (Orbit) وبدون أخطاء */}
        {isHovered && particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              x: [
                Math.cos(p.angle) * p.distance, 
                Math.cos(p.angle + Math.PI) * p.distance, 
                Math.cos(p.angle + Math.PI * 2) * p.distance
              ],
              y: [
                Math.sin(p.angle) * p.distance, 
                Math.sin(p.angle + Math.PI) * p.distance, 
                Math.sin(p.angle + Math.PI * 2) * p.distance
              ],
            }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
            className="absolute bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </motion.div>
    </div>
  );
}