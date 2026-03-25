"use client"
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useMemo } from "react";
import { Quote, Star } from "lucide-react";
import { Review } from "@/src/constants/reviews-data";
import Image from "next/image";

const getFlagURL = (country: string) => {
  const codes: Record<string, string> = { EG: "eg", UAE: "ae", SA: "sa" };
  return `https://flagcdn.com/${codes[country] || "eg"}.svg`;
};

export const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  
  // 1. استخدام MotionValues للتحديث المباشر خارج دورة ريندر ريأكت
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // 2. إعدادات فيزياء الحركة (Spring Physics)
  const springConfig = { stiffness: 150, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [12, -12]), springConfig);
  const rotateY = useSpring(useSpring(useTransform(x, [0, 1], [-12, 12]), springConfig));
  
  const scale = useSpring(isPressed ? 0.94 : 1, springConfig);
  const translateZ = useSpring(isPressed ? -30 : 0, springConfig);

  // 3. معالج حركة المؤشر (Memoized لتقليل استهلاك الذاكرة)
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }, [x, y]);

  // 4. حساب التأثيرات الضوئية ديناميكياً (GPU Accelerated)
  const spotlightGradient = useTransform([x, y], ([lx, ly]) => 
    `radial-gradient(500px circle at ${Number(lx) * 100}% ${Number(ly) * 100}%, ${review.color}15, transparent 80%)`
  );

  const borderGradient = useTransform([x, y], ([lx, ly]) => 
    `conic-gradient(from 0deg at ${Number(lx) * 100}% ${Number(ly) * 100}%, transparent, ${review.color}, transparent)`
  );

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { x.set(0.5); y.set(0.5); setIsPressed(false); }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ 
        rotateX, 
        rotateY, 
        scale, 
        translateZ, 
        transformStyle: "preserve-3d",
        willChange: "transform, opacity" 
      }}
      className="relative group h-full touch-none select-none cursor-pointer active:cursor-grabbing transform-gpu"
    >
      {/* تأثير الـ Border Glow الخارجي */}
      <motion.div 
        className="absolute -inset-[1px] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none blur-[1px]"
        style={{ background: borderGradient }}
      />

      <div className="relative z-10 p-7 md:p-9 rounded-[2.5rem] bg-[#070707]/90 backdrop-blur-2xl border border-white/[0.04] shadow-2xl h-full flex flex-col overflow-hidden">
        
        {/* تأثير الـ Spotlight الداخلي */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: spotlightGradient }}
        />

        {/* Header Section */}
        <div className="mb-8 flex justify-between items-start flex-row-reverse relative z-20">
          <motion.div 
            whileTap={{ scale: 0.85 }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-inner"
          >
            <Quote size={22} style={{ color: review.color }} className="drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
          </motion.div>
          <div className="flex flex-col gap-1.5 text-right">
            <div className="flex gap-1 flex-row-reverse">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              ))}
            </div>
            <span className="text-[9px] text-gray-500 font-cairo font-black tracking-[0.25em] opacity-60">PLATINUM CLIENT</span>
          </div>
        </div>

        {/* Testimonial Text */}
        <div className="flex-1 flex items-center mb-12 relative z-20">
          <motion.p 
            animate={{ color: isPressed ? "#fff" : "#e5e7eb" }}
            className="text-gray-200 text-lg md:text-2xl leading-[1.85] text-right font-cairo font-medium" 
            dir="rtl"
          >
            "{review.text}"
          </motion.p>
        </div>

        {/* Client Profile Footer */}
        <div className="flex flex-row-reverse items-center gap-4 pt-7 border-t border-white/[0.06] mt-auto relative z-20">
          <div className="relative group/avatar">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-cairo text-white relative z-10 transition-transform duration-500 group-hover/avatar:scale-110 shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${review.color}, ${review.color}80)` }}
            >
              {review.initial}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-[#070707] z-20 shadow-lg" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 z-10 animate-ping opacity-60" />
          </div>
          
          <div className="text-right flex-1 min-w-0">
            <div className="flex flex-row-reverse items-center gap-2.5 mb-1">
                <h4 className="text-white font-bold text-base md:text-lg truncate transition-colors group-hover:text-white">
                  {review.name}
                </h4>
                <div className="overflow-hidden rounded-[2px] shadow-sm ring-1 ring-white/10 shrink-0">
                    <Image
                        width={18}
                        height={12}               
                        src={getFlagURL(review.country)} 
                        alt={review.country}
                        className="object-cover"
                    />
                </div>
            </div>
            <p className="text-gray-500 text-[10px] font-cairo font-black uppercase tracking-widest opacity-70">
              {review.role}
            </p>
          </div>
        </div>

        {/* تأثير الـ Wave عند الضغط (Liquid Effect) */}
        <AnimatePresence>
          {isPressed && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 0.12 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{ background: review.color }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};