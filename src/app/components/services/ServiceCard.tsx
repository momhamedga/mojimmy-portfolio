"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, memo } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Service } from "@/src/constants/services";
import Link from "next/link";

export const ServiceCard = memo(({ service, index }: { service: Service; index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // فيزياء الحركة (Smooth Spring)
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  const yText = useSpring(useTransform(scrollYProgress, [0, 1], [80, -80]), springConfig);
  const rotateShape = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scaleImage = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.2, 0.9]);
  const opacityText = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center sticky top-0 overflow-hidden border-b border-white/5 "
    >
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
        
        {/* الجهة اليمنى: المحتوى النصي (RTL) */}
        <motion.div 
          style={{ y: yText, opacity: opacityText }}
          className="order-2 lg:order-1 space-y-6 md:space-y-8 text-right" 
          dir="rtl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em]">الخدمة رقم {service.id}</span>
          </div>

          <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter">
            {service.arabicTitle.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-l from-purple-500 via-blue-500 to-cyan-400" : ""}>
                {word}{" "}
              </span>
            ))}
          </h2>

          <p className="text-gray-400 text-base md:text-xl max-w-lg leading-relaxed font-light">
            {service.description}
          </p>

          <div className="flex flex-wrap justify-start gap-3">
            {service.tech.map((t) => (
              <span key={t} className="px-3 py-1 text-[10px] md:text-xs font-bold text-white/50 border-r-2 border-purple-500/50 pr-3 bg-white/5 hover:bg-white/10 transition-colors">
                {t}
              </span>
            ))}
          </div>
         <Link href={"#contact"}>
          <motion.button 
            whileHover={{ x: -10 }}
            whileTap={{ scale: 0.96 }}
            className="group flex items-center gap-5 text-white text-lg md:text-2xl font-black pt-6 md:pt-10 transition-all"
          >
   
                <span className="group-hover:text-purple-400 transition-colors">ابدأ رحلتك معنا</span>
      
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-active:scale-90 transition-all duration-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <ArrowLeft size={24} />
            </div>
            </motion.button>
                  </Link>
        </motion.div>

        {/* الجهة اليسرى: العنصر البصري التفاعلي */}
        <div className="order-1 lg:order-2 relative flex justify-center items-center h-[250px] md:h-[500px] lg:h-[600px]">
          {/* خلفية ضوئية متوهجة */}
      <motion.div
  style={{ 
    rotate: rotateShape, 
    backgroundColor: service.color 
  }}
  className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full opacity-30 blur-[80px] md:blur-[120px]"
/>

          {/* العنصر الرئيسي */}
          <motion.div 
            style={{ scale: scaleImage, rotate: rotateShape }}
            className="relative z-10 w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center border border-white/10 rounded-[2.5rem] md:rounded-[4rem] bg-white/[0.03] backdrop-blur-2xl shadow-2xl will-change-transform"
          >
             <div style={{ color: service.color }} className="scale-[2.5] md:scale-[4] lg:scale-[5] opacity-90 drop-shadow-2xl">
                {service.icon}
             </div>
             
             {/* زينة هندسية */}
             {[...Array(3)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                 transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border border-white/5 rounded-full pointer-events-none"
                 style={{ margin: `-${(i + 1) * 25}px` }}
               />
             ))}
          </motion.div>

          {/* نص خلفي عملاق (Watermark) */}
          <span className="absolute -bottom-6 md:-bottom-10 right-0 text-[18vw] font-black text-white/[0.02] pointer-events-none select-none italic tracking-tighter uppercase leading-none">
            {service.id}
          </span>
        </div>
      </div>
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";