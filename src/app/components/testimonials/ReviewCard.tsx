"use client"
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Quote, Star } from "lucide-react";
import { Review } from "@/src/constants/reviews-data";
import Image from "next/image";

const getFlagURL = (country: string) => {
  const codes: Record<string, string> = { EG: "eg", UAE: "ae", SA: "sa" };
  return `https://flagcdn.com/${codes[country]}.svg`;
};

export const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  
  // حساسات اللمس
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // فيزياء "مغناطيسية" (Stiff springs for tactile feel)
  const springConfig = { stiffness: 250, damping: 25 };
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), springConfig);
  
  // تأثير "الغطس" العميق عند اللمس
  const scale = useSpring(isPressed ? 0.92 : 1, springConfig);
  const translateZ = useSpring(isPressed ? -40 : 0, springConfig);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { x.set(0.5); y.set(0.5); setIsPressed(false); }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ rotateX, rotateY, scale, translateZ, transformStyle: "preserve-3d" }}
      className="relative group h-full touch-none select-none cursor-pointer active:cursor-grabbing"
    >
      {/* 1. تأثير الـ Glow اللي بيلحق الصباع على الحواف */}
      <motion.div 
        className="absolute -inset-[1px] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2.5rem] pointer-events-none"
        style={{
          background: useTransform([x, y], ([lx, ly]) => 
            `conic-gradient(from 0deg at ${Number(lx) * 100}% ${Number(ly) * 100}%, transparent, ${review.color}, transparent)`
          )
        }}
      />

      <div className="relative z-10 p-8 rounded-[2.5rem] bg-[#070707]/95 backdrop-blur-3xl border border-white/[0.03] shadow-2xl h-full flex flex-col overflow-hidden">
        
        {/* 2. تأثير الـ Spotlight الداخلي */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform([x, y], ([lx, ly]) => 
              `radial-gradient(600px circle at ${Number(lx) * 100}% ${Number(ly) * 100}%, ${review.color}15, transparent 80%)`
            )
          }}
        />

        {/* التقييم العلوي */}
        <div className="mb-6 flex justify-between items-start flex-row-reverse relative z-20">
          <motion.div 
            whileTap={{ scale: 0.8 }}
            className="p-3 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10"
          >
            <Quote size={24} style={{ color: review.color }} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          </motion.div>
          <div className="flex flex-col gap-1.5 text-right">
            <div className="flex gap-1 flex-row-reverse">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-yellow-500 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.4)]" />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 font-mono font-bold tracking-[0.2em]">PLATINUM CLIENT</span>
          </div>
        </div>

        {/* نص الشهادة مع "تأثير الظهور" */}
        <div className="flex-1 flex items-center mb-10 relative z-20">
            <motion.p 
              animate={{ color: isPressed ? "#fff" : "#d1d5db" }}
              className="text-gray-200 text-xl md:text-2xl leading-[1.8] text-right font-arabic font-medium" 
              dir="rtl"
            >
              "{review.text}"
            </motion.p>
        </div>

        {/* بروفايل العميل المصمم كـ Button Action */}
        <motion.div 
          className="flex flex-row-reverse items-center gap-4 pt-6 border-t border-white/[0.05] mt-auto relative z-20"
        >
          <div className="relative group/avatar">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white relative z-10 transition-transform group-hover/avatar:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              style={{ background: `linear-gradient(135deg, ${review.color}, ${review.color}70)` }}
            >
              {review.initial}
            </div>
            {/* مؤشر النبض */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-[#070707] z-20 shadow-lg" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 z-10 animate-ping opacity-75" />
          </div>
          
          <div className="text-right flex-1 min-w-0">
            <div className="flex flex-row-reverse items-center gap-2 mb-0.5">
                <h4 className="text-white font-bold text-base md:text-lg transition-colors group-hover:text-white">
                  {review.name}
                </h4>
                <div className="overflow-hidden rounded-sm shadow-sm ring-1 ring-white/10">
                    <Image
                        width={20}
                        height={14}              
                        src={getFlagURL(review.country)} 
                        alt={review.country}
                        className="object-cover"
                    />
                </div>
            </div>
            <p className="text-gray-500 text-[10px] font-mono font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
              {review.role}
            </p>
          </div>
        </motion.div>

        {/* 3. تأثير الـ Wave عند الضغط المطول */}
        <AnimatePresence>
          {isPressed && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{ background: review.color }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};