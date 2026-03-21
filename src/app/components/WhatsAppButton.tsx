"use client"
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useRef, useState, useMemo } from "react";

export default function WhatsAppButton() {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // 1. Motion Values (التحكم بدون Re-render)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const hoverOpacity = useMotionValue(0.15);
  const hoverScale = useMotionValue(1);

  // 2. تكييف الحركة المغناطيسية (Magnetic Physics)
  const mouseX = useSpring(x, { stiffness: 60, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 60, damping: 15 });

  const rotateX = useTransform(mouseY, [-50, 50], [15, -15]);
  const rotateY = useTransform(mouseX, [-50, 50], [-15, 15]);

  // 3. جزيئات ثابتة (Pure Data)
  const particles = useMemo(() => [
    { id: 1, angle: 0, distance: 45, size: 4, duration: 3 },
    { id: 2, angle: 120, distance: 50, size: 2, duration: 4 },
    { id: 3, angle: 240, distance: 40, size: 3, duration: 2.5 },
  ], []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const moveX = (e.clientX - (left + width / 2)) * 0.35;
    const moveY = (e.clientY - (top + height / 2)) * 0.35;
    x.set(moveX);
    y.set(moveY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    animate(hoverOpacity, 0.4, { duration: 0.3 });
    animate(hoverScale, 1.6, { duration: 0.3 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    animate(hoverOpacity, 0.15, { duration: 0.3 });
    animate(hoverScale, 1, { duration: 0.3 });
  };

  return (
    <div className="fixed bottom-10 left-10 z-[999] hidden md:block select-none">
      {/* سحابة Live Support */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={isHovered ? { opacity: 1, x: 100 } : { opacity: 0, x: 20 }}
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-[1000]"
      >
        <div className="bg-black/90 backdrop-blur-md border border-green-500/30 text-white text-[10px] font-bold uppercase tracking-[0.2em] py-2 px-5 rounded-xl rounded-bl-none shadow-2xl flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Support
        </div>
      </motion.div>

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ 
          x: mouseX, 
          y: mouseY, 
          rotateX, 
          rotateY, 
          perspective: "1000px",
          transformStyle: "preserve-3d" 
        }}
        className="relative flex items-center justify-center w-28 h-28 cursor-pointer touch-none"
      >
        {/* هالة النيون الخلفية - محددة بـ MotionValue للأداء */}
        <motion.div 
          style={{ scale: hoverScale, opacity: hoverOpacity }}
          className="absolute inset-6 bg-green-500 rounded-full blur-[35px] pointer-events-none" 
        />

        {/* حلقات النبض الهادئة */}
        <div className="absolute inset-10 bg-green-500/20 rounded-full animate-pulse pointer-events-none" />
        
        {/* الزر الأساسي */}
        <motion.a 
          href="https://wa.me/+971589915968"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(18,140,126,0.3)] overflow-hidden"
          whileTap={{ scale: 0.9 }}
        >
          {/* Shine Effect */}
          <motion.div 
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[35deg]"
          />
          <MessageCircle className="text-white w-7 h-7 fill-white" />
        </motion.a>

        {/* جزيئات النيون المدارية */}
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
            className="absolute bg-green-400 rounded-full shadow-[0_0_8px_#4ade80] pointer-events-none"
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </motion.div>
    </div>
  );
}