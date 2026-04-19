"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, memo } from "react";
import { ArrowUpLeft, Zap } from "lucide-react";
import Link from "next/link";

// 1. تعريف الـ Interface محلياً للتأكد من اختفاء الخطوط الحمراء
interface ServiceType {
  id: number | string;
  arabicTitle: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  tech: string[];
}

interface ServiceCardProps {
  service: ServiceType;
  index: number;
}

export const ServiceCard = memo(({ service, index }: ServiceCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  
  // تحديد الأنواع للـ Framer Motion Transforms
  const scale = useTransform(smoothProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.9, 1]);
  const rotateX = useTransform(smoothProgress, [0, 1], [-10, 0]);
  
  const accentColor = service.color || 'oklch(0.7 0.2 285)';

  return (
    <div 
      ref={containerRef}
      className="min-h-[90vh] md:min-h-screen w-full flex items-center justify-center sticky top-0 py-6 md:py-20"
      style={{ perspective: "1000px" }}
    >
      <motion.div 
        style={{ scale, opacity, rotateX }}
        className="container mx-auto px-4 md:px-6 w-full max-w-7xl transform-gpu will-change-transform"
      >
        <div className="relative flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-10 p-6 md:p-20 rounded-[2.5rem] md:rounded-[5rem] border border-white/5 bg-[oklch(0.12_0.01_0_/_0.8)] backdrop-blur-[30px] md:backdrop-blur-[50px] overflow-hidden shadow-2xl">
          
          <div 
            className="absolute -top-24 -right-24 w-64 h-64 md:w-96 md:h-96 opacity-[0.07] blur-[80px] md:blur-[120px] rounded-full pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          <div className="order-1 lg:order-2 flex items-center justify-center relative min-h-[200px] md:min-h-[300px]">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-[1px] border-dashed border-white/5 rounded-full scale-90 md:scale-100"
             />
             
             <div 
               className="relative z-10 w-32 h-32 md:w-80 md:h-80 flex items-center justify-center rounded-[2rem] md:rounded-[5rem] bg-white/[0.02] border border-white/10 backdrop-blur-2xl transition-all duration-700"
               style={{ boxShadow: `0 0 50px ${accentColor}10` }}
             >
                <div 
                  className="text-5xl md:text-[10rem] transition-all duration-700"
                  style={{ color: accentColor }}
                >
                  {service.icon}
                </div>
             </div>
          </div>

          <motion.div 
            className="order-2 lg:order-1 flex flex-col justify-center items-start text-right space-y-6 md:space-y-8" 
            dir="rtl"
          >
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5"
              style={{ color: accentColor }}
            >
              <Zap size={14} fill="currentColor" />
              <span className="text-[10px] font-mono font-black uppercase tracking-widest">Phase 0{index + 1}</span>
            </div>

            <h2 className="text-3xl md:text-8xl font-cairo font-black text-white leading-tight md:leading-[0.9] tracking-tighter">
              {service.arabicTitle}
            </h2>

            <p className="text-white/40 text-sm md:text-2xl font-cairo font-light leading-relaxed max-w-xl">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {service.tech.map((t) => (
                <span key={t} className="px-3 py-1 md:px-5 md:py-2 text-[9px] md:text-xs font-bold uppercase tracking-wider text-white/20 bg-white/[0.02] border border-white/5 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <Link href="#contact" className="group pt-6 md:pt-10 self-stretch md:self-auto">
              <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 p-4 md:p-0 rounded-2xl border border-white/5 md:border-none bg-white/[0.01] md:bg-transparent">
                 <div className="w-12 h-12 md:w-24 md:h-24 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <ArrowUpLeft size={24} className="group-hover:rotate-45 transition-transform" />
                 </div>
                 <span className="text-lg md:text-3xl font-cairo font-bold text-white/50 group-hover:text-white">تواصل معنا</span>
              </div>
            </Link>
          </motion.div>
          
        </div>
      </motion.div>
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";