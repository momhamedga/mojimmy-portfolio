"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, memo } from "react";
import { ArrowUpLeft, Zap } from "lucide-react";
import { Service } from "@/src/constants/services";
import Link from "next/link";

export const ServiceCard = memo(({ service, index }: { service: Service; index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  // فيزياء الحركة (Spring) - مريحة للعين وسريعة الاستجابة
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  
  // أنيميشن العناصر
  const scale = useTransform(smoothProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.8, 1]);
  const rotate = useTransform(smoothProgress, [0, 1], [-5, 0]);
  
  // استخراج درجة اللون للهيفر (نظام OKLCH)
  const accentColor = service.color || 'oklch(0.7 0.2 285)';

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center sticky top-0 py-10 md:py-20"
      style={{ perspective: "1200px" }}
    >
      <motion.div 
        style={{ scale, opacity, rotateX: rotate }}
        className="container mx-auto px-6 w-full max-w-7xl transform-gpu"
      >
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 md:p-20 rounded-[3rem] md:rounded-[5rem] border border-white/5 bg-[oklch(0.15_0.02_0_/_0.6)] backdrop-blur-[50px] overflow-hidden shadow-2xl">
          
          {/* إضاءة خلفية دايناميكية */}
          <div 
            className="absolute -top-24 -right-24 w-96 h-96 opacity-10 blur-[120px] rounded-full pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          {/* الجانب النصي */}
          <motion.div 
            className="order-2 lg:order-1 flex flex-col justify-center items-start text-right space-y-8" 
            dir="rtl"
          >
            <div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5"
              style={{ color: accentColor }}
            >
              <Zap size={16} fill="currentColor" />
              <span className="text-xs font-mono font-black uppercase tracking-widest">Phase 0{index + 1}</span>
            </div>

            <h2 className="text-5xl md:text-8xl font-cairo font-black text-white leading-[0.9] tracking-tighter">
              {service.arabicTitle}
            </h2>

            <p className="text-white/40 text-lg md:text-2xl font-cairo font-light leading-relaxed max-w-xl">
              {service.description}
            </p>

            {/* الـ Tech Tags بنظام الـ Pills */}
            <div className="flex flex-wrap gap-2 pt-4">
              {service.tech.map((t) => (
                <span key={t} className="px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/30 bg-white/[0.02] border border-white/5 rounded-full hover:border-[oklch(0.7_0.2_285_/_0.3)] transition-all">
                  {t}
                </span>
              ))}
            </div>

            <Link href="#contact" className="group pt-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-700 shadow-xl group-hover:shadow-[0_0_50px_oklch(1_0_0_/_0.1)]">
                   <ArrowUpLeft size={32} className="group-hover:rotate-45 transition-transform duration-500" />
                 </div>
                 <span className="text-xl md:text-3xl font-cairo font-bold text-white/50 group-hover:text-white transition-colors">تحدث معنا</span>
              </div>
            </Link>
          </motion.div>

          {/* الجانب البصري (The Hero Icon) */}
          <div className="order-1 lg:order-2 flex items-center justify-center relative min-h-[300px]">
             {/* حلقة دوران نيون */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-[1px] border-dashed border-white/10 rounded-full scale-75 md:scale-100"
             />
             
             <div 
               className="relative z-10 w-48 h-48 md:w-80 md:h-80 flex items-center justify-center rounded-[3rem] md:rounded-[5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 shadow-inner backdrop-blur-2xl group transition-all duration-700 hover:scale-105"
               style={{ boxShadow: `0 0 80px ${accentColor}15` }}
             >
                <div 
                  className="text-7xl md:text-[10rem] transition-all duration-700 filter grayscale group-hover:grayscale-0 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  style={{ color: accentColor }}
                >
                  {service.icon}
                </div>
                
                {/* Floating Elements للموبايل */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center animate-bounce">
                   <Zap size={20} style={{ color: accentColor }} />
                </div>
             </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";