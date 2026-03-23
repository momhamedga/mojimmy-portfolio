"use client"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, memo } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Service } from "@/src/constants/services";
import Link from "next/link";

export const ServiceCard = memo(({ service, index }: { service: Service; index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // ✅ تحسين: تقليل نطاق الحساب ليكون فقط عندما يكون الكارت في الشاشة
    offset: ["start end", "end start"]
  });

  // ✅ تحسين الفيزياء: تقليل الـ stiffness عشان الحركة تكون أهدى وأخف على المعالج
  const springConfig = { stiffness: 70, damping: 30, restDelta: 0.01 };
  
  const yText = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), springConfig);
  const rotateShape = useTransform(scrollYProgress, [0, 1], [0, 90]); // قللنا زاوية الدوران
  const scaleImage = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]); // قللنا الـ scale
  const opacityText = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={containerRef}
      // ✅ تحسين: إزالة border-b لو مش ضروري لتقليل الـ Layers
      className="min-h-[100svh] w-full flex items-center justify-center sticky top-0 overflow-hidden bg-transparent"
    >
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-transparent">
        
        {/* النص - استخدمنا translate-z-0 لتفعيل الـ GPU */}
        <motion.div 
          style={{ y: yText, opacity: opacityText }}
          className="order-2 lg:order-1 space-y-6 text-right transform-gpu" 
          dir="rtl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] md:text-xs font-cairo uppercase tracking-[0.2em]">الخدمة {service.id}</span>
          </div>

          <h2 className="text-4xl md:text-7xl lg:text-8xl font-cairo text-white leading-[1.1] tracking-tighter">
            {service.arabicTitle.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-l from-purple-500 via-blue-500 to-cyan-400" : ""}>
                {word}{" "}
              </span>
            ))}
          </h2>

          <p className="text-gray-400 text-base md:text-xl max-w-lg leading-relaxed font-cairo">
            {service.description}
          </p>

          <div className="flex flex-wrap justify-start gap-3">
            {service.tech.map((t) => (
              <span key={t} className="px-3 py-1 text-[10px] md:text-xs font-cairo text-white/50 border-r-2 border-purple-500/50 pr-3 bg-white/5 transition-colors">
                {t}
              </span>
            ))}
          </div>

          <Link href={"#contact"}>
            <motion.button 
              whileHover={{ x: -10 }}
              whileTap={{ scale: 0.96 }}
              className="group flex items-center gap-5 text-white text-lg md:text-2xl font-cairo pt-6 transition-all transform-gpu"
            >
              <span className="group-hover:text-purple-400 transition-colors">ابدأ رحلتك معنا</span>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <ArrowLeft size={24} />
              </div>
            </motion.button>
          </Link>
        </motion.div>

        {/* العنصر البصري */}
        <div className="order-1 lg:order-2 relative flex justify-center items-center h-[300px] md:h-[500px]">
          {/* الخلفية الضوئية - تقليل الـ blur لأنه بيسخن الجهاز */}
          <motion.div
            style={{ rotate: rotateShape, backgroundColor: service.color }}
            className="absolute w-[180px] h-[180px] md:w-[350px] md:h-[350px] rounded-full opacity-20 blur-[60px] md:blur-[100px] will-change-transform"
          />

          <motion.div 
            style={{ scale: scaleImage, rotate: rotateShape }}
            // ✅ أهم تعديل: إضافة will-change-transform و transform-gpu
            className="relative z-10 w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center border border-white/10 rounded-[2.5rem] md:rounded-[4rem] bg-white/[0.02] backdrop-blur-xl shadow-2xl transform-gpu will-change-transform"
          >
             <div style={{ color: service.color }} className="scale-[2.5] md:scale-[4] opacity-90 drop-shadow-2xl">
                {service.icon}
             </div>
             
             {/* الزينة الهندسية - تقليل العدد لـ 2 فقط بدل 3 للأداء */}
             {[...Array(2)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                 transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border border-white/5 rounded-full pointer-events-none"
                 style={{ margin: `-${(i + 1) * 30}px` }}
               />
             ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";