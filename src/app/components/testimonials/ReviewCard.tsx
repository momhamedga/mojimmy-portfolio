"use client"
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, memo } from "react";
import { Quote, Star } from "lucide-react";
import { Review } from "@/src/constants/reviews-data";
import Image from "next/image";

// تحسين أداء جلب الأعلام
const getFlagURL = (country: string) => {
  const codes: Record<string, string> = { EG: "eg", UAE: "ae", SA: "sa" };
  return `https://flagcdn.com/${codes[country] || "eg"}.svg`;
};

export const ReviewCard = memo(({ review }: { review: Review }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.6 };
  
  // تصحيح: تم تبسيط الـ Spring لمنع الـ Double-springing اللي بيبطئ الحركة
  const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-10, 10]), springConfig);
  
  const scale = useSpring(isPressed ? 0.95 : 1, springConfig);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }, [x, y]);

  // استخدام متغيرات الـ Theme Colors في الجرادينت
  const spotlightGradient = useTransform([x, y], ([lx, ly]) => 
    `radial-gradient(400px circle at ${Number(lx) * 100}% ${Number(ly) * 100}%, var(--color-primary-transparent), transparent 80%)`
  );

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { x.set(0.5); y.set(0.5); setIsPressed(false); }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      className="relative group h-full touch-none select-none will-change-transform transform-gpu"
    >
      <div className="relative z-10 p-8 md:p-10 rounded-[2.5rem] bg-glass border border-white/[0.05] shadow-2xl h-full flex flex-col overflow-hidden backdrop-blur-3xl">
        
        {/* Spotlight Effect */}
        <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: spotlightGradient }} />

        {/* Header */}
        <div className="mb-8 flex justify-between items-start flex-row-reverse relative z-20">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <Quote size={20} className="text-primary" />
          </div>
          <div className="flex flex-col gap-1.5 text-right">
            <div className="flex gap-1 flex-row-reverse">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-yellow-500 text-yellow-500 shadow-yellow-500/50 shadow-xl" />
              ))}
            </div>
            <span className="text-[9px] text-primary font-black tracking-widest opacity-80 uppercase">Platinum Partner</span>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 mb-10 relative z-20">
          <p className="text-gray-200 text-lg md:text-xl leading-[1.8] text-right font-cairo" dir="rtl">
            "{review.text}"
          </p>
        </div>

        {/* Footer Profile */}
        <div className="flex flex-row-reverse items-center gap-4 pt-6 border-t border-white/5 mt-auto relative z-20">
          <div className="relative group/avatar">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-primary to-accent shadow-2xl">
              {review.initial}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#070707]" />
          </div>
          
          <div className="text-right flex-1 min-w-0">
            <div className="flex flex-row-reverse items-center gap-2 mb-0.5">
              <h4 className="text-white font-bold text-base truncate">{review.name}</h4>
              <Image width={18} height={12} src={getFlagURL(review.country)} alt={review.country} className="rounded-sm" />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{review.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ReviewCard.displayName = "ReviewCard";