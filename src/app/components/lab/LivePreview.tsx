"use client"
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export const LivePreview = ({ type, settings }: { type: string, settings: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // قيم الحركة الأساسية
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // فيزياء الحركة المخصصة للموبايل (Spring Physics)
  // القوة (Stiffness) والنعومة (Damping) مربوطة باختيارات المستخدم في الـ Lab
  const springConfig = { 
    stiffness: (settings.strength || 0.3) * 600, 
    damping: 25 + (settings.strength || 0.3) * 10 
  };
  
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // تأثيرات بصرية إضافية (تغير الحجم والشفافية بناءً على المسافة من المركز)
  const scale = useTransform(smoothX, [-150, 0, 150], [0.8, 1.1, 0.8]);
  const rotateEffect = useTransform(smoothX, [-150, 150], [-45, 45]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // حساب المركز بدقة متناهية للتاتش
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    if (type === "01") {
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const resetPosition = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      onPointerUp={resetPosition} // مهم جداً للموبايل عند رفع الإصبع
      className="w-full h-full min-h-[350px] flex items-center justify-center bg-[#080808] rounded-[2.5rem] relative overflow-hidden cursor-none touch-none border border-white/5 shadow-inner"
    >
      {/* شبكة إحداثيات خلفية خفيفة تعطي إحساس "المختبر" */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

      {/* تجربة 01: الجاذبية المغناطيسية */}
      {type === "01" && (
        <div className="relative">
          {/* ظل ضوئي يتبع العنصر */}
<motion.div
  className="absolute inset-0 w-20 h-20 rounded-full blur-[50px] opacity-30"
  style={{ 
    backgroundColor: '#a855f7', 
    x: smoothX, 
    y: smoothY 
  }}
/>
          <motion.div 
            style={{ 
              x: smoothX, 
              y: smoothY,
              scale: scale,
              rotate: rotateEffect
            }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-gradient-to-tr from-purple-600 via-blue-500 to-cyan-400 shadow-2xl flex items-center justify-center group"
          >
             <div className="w-8 h-8 rounded-full border-4 border-white/20 animate-pulse" />
          </motion.div>
        </div>
      )}

      {/* تجربة 02: تموجات الطاقة السحابية */}
      {type === "02" && (
        <div className="relative flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div 
               key={i}
               animate={{ 
                 scale: [1, 1.5 + (i * 0.2), 1],
                 rotate: i % 2 === 0 ? 360 : -360,
                 borderRadius: ["30%", "50%", "30%"]
               }}
               transition={{ 
                 duration: (8 / (settings.speed || 1)) + i, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
               className="absolute border border-emerald-500/30"
               style={{ 
                 width: 100 + i * 50, 
                 height: 100 + i * 50,
                 opacity: (settings.frequency || 10) / 30 
               }}
            />
          ))}
          <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]" />
        </div>
      )}

      {/* واجهة إرشادية للمستخدم */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[10px] text-white/40 font-mono tracking-[0.3em] uppercase bg-white/5 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          المعاينة المباشرة • LIVE PREVIEW
        </span>
        <p className="text-[9px] text-gray-600 font-arabic italic">
          {type === "01" ? "حرّك إصبعك لتجربة الجاذبية" : "لاحظ تغير التردد والسرعة"}
        </p>
      </div>

      {/* زوايا تقنية للـ UI */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 rounded-tr-lg" />
    </div>
  );
};