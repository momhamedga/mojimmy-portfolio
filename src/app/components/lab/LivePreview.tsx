"use client"
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, memo } from "react";

export const LivePreview = memo(({ type, settings }: { type: string, settings: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // قيم الحركة الأساسية (إحداثيات الماوس/التاتش)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // ✅ فيزياء الحركة المتقدمة (Physics Engine)
  // Stiffness: قوة سحب المغناطيس، Damping: مدى مقاومة الحركة (النعومة)
  const springConfig = { 
    stiffness: (settings.strength || 1) * 200, 
    damping: 20 + (settings.strength || 1) * 5,
    mass: 0.5 
  };
  
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // ✅ تأثيرات سينمائية بناءً على الموقع
  const rotateX = useTransform(smoothY, [-200, 200], [25, -25]);
  const rotateY = useTransform(smoothX, [-200, 200], [-25, 25]);
  const brightness = useTransform(smoothX, [-150, 150], [0.8, 1.2]);
  const scale = useTransform(smoothX, [-150, 0, 150], [0.9, 1.1, 0.9]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // حساب المركز النسبي بدقة (0 هو المنتصف)
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    mouseX.set(x);
    mouseY.set(y);
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
      className="w-full h-full min-h-[400px] flex items-center justify-center bg-[#050505] rounded-[2rem] md:rounded-[4rem] relative overflow-hidden cursor-crosshair touch-none select-none border border-white/5 transform-gpu"
    >
      {/* 1. خلفية المختبر (Grid System) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(circle at center, #fff 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }} />
      
      {/* 2. الإضاءة العائمة (Ambient Light) */}
      <motion.div 
        style={{ x: smoothX, y: smoothY, filter: 'blur(100px)' }}
        className="absolute w-64 h-64 rounded-full opacity-20 pointer-events-none"
        animate={{ 
          backgroundColor: type === "01" ? "oklch(0.7 0.2 285)" : "oklch(0.7 0.2 150)" 
        }}
      />

      {/* --- تجربة 01: المغناطيس الذكي --- */}
      <AnimatePresence mode="wait">
        {type === "01" && (
          <motion.div 
            key="exp-01"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="relative"
            style={{ rotateX, rotateY, scale, perspective: 1000 }}
          >
            {/* "النواة" المغناطيسية */}
            <motion.div 
              style={{ x: smoothX, y: smoothY }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-white/[0.03] border border-white/20 backdrop-blur-3xl shadow-2xl flex items-center justify-center transform-gpu"
            >
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full border border-dashed border-purple-500/50" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_#fff]" />
                </div>
              </div>
              
              {/* تفاصيل تقنية صغيرة */}
              <div className="absolute -bottom-6 flex flex-col items-center gap-1">
                 <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Gravity-Lock</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* --- تجربة 02: تموجات التردد (Frequency Ripples) --- */}
        {type === "02" && (
          <motion.div 
            key="exp-02"
            className="relative flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div 
                 key={i}
                 animate={{ 
                   scale: [1, 2 + (i * 0.5), 1],
                   opacity: [0.1, 0.4, 0.1],
                   rotate: i % 2 === 0 ? 360 : -360
                 }}
                 transition={{ 
                   duration: (10 / (settings.speed || 1)) + (i * 0.5), 
                   repeat: Infinity, 
                   ease: "easeInOut" 
                 }}
                 className="absolute border border-[oklch(0.7_0.2_150_/_0.3)] rounded-[35%]"
                 style={{ 
                   width: 100 + i * 60, 
                   height: 100 + i * 60,
                   x: smoothX.get() * (i * 0.1), // تأثير بارالاكس خفيف
                   y: smoothY.get() * (i * 0.1)
                 }}
              />
            ))}
            <motion.div 
               style={{ x: smoothX, y: smoothY }}
               className="w-6 h-6 bg-[oklch(0.7_0.2_150)] rounded-full shadow-[0_0_40px_oklch(0.7_0.2_150)]" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. عناصر الواجهة الإرشادية (Hud Elements) */}
      <div className="absolute top-8 left-8 flex flex-col gap-2">
         <div className="flex items-center gap-2 text-white/20 font-mono text-[10px]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE SIGNAL: {Math.round(smoothX.get())}px
         </div>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-3">
        <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.5em] bg-white/[0.02] border border-white/10 px-6 py-2 rounded-full backdrop-blur-xl">
           Neural Feedback Engine
        </span>
        <p className="text-[11px] text-white/10 font-cairo">
          {type === "01" ? "التفاعل المغناطيسي نشط - حرّك لاستكشاف القصور الذاتي" : "تموجات التردد تتأثر بسرعة المعالجة الحالية"}
        </p>
      </div>

      {/* تأثير "الفيلم" (Noise Overlay) لإعطاء طابع المختبر */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] contrast-150 brightness-150" 
           style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
    </div>
  );
});

LivePreview.displayName = "LivePreview";