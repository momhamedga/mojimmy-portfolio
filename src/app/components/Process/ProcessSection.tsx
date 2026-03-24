"use client"
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { PROCESS_STEPS } from "@/src/constants/process-steps";
import { cn } from "@/src/lib/utils";

export default function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // تتبع السكرول - معايير 2026 للاستجابة السريعة
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end 10%"]
  });

  // تنعيم الخط الضوئي (Spring Physics)
  const scaleY = useSpring(scrollYProgress, { 
    stiffness: 80, 
    damping: 25, 
    restDelta: 0.001 
  });

  return (
    <section ref={containerRef} id="process" className="relative py-32 md:py-48 overflow-hidden  selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Cinematic */}
        <div className="mb-32 md:mb-56 text-right relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-purple-500 font-cairo font-black tracking-[0.4em] text-[10px] md:text-xs uppercase block mb-6 opacity-80">
              The Engineering Roadmap
            </span>
            <h2 className="text-5xl md:text-9xl font-black text-white font-cairo leading-[0.85] tracking-tighter">
              رحلة تحويل <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-500 via-blue-500 to-emerald-500">
                الفكرة
              </span> لواقع
            </h2>
          </motion.div>
        </div>

        <div className="relative min-h-[1000px]">
          {/* الخط المركزي (The Light Path) */}
          <div className="absolute right-[12px] md:right-1/2 top-0 bottom-0 w-[1px] md:w-[2px] bg-white/[0.03] md:translate-x-1/2">
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute inset-0 w-full bg-gradient-to-b from-purple-600 via-blue-500 to-emerald-500 shadow-[0_0_40px_rgba(168,85,247,0.4)] will-change-transform"
            />
          </div>

          {/* عرض المراحل */}
          <div className="relative space-y-32 md:space-y-64">
            {PROCESS_STEPS.map((step, i) => (
              <StepItem key={step.id} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}

function StepItem({ step, index }: { step: any, index: number }) {
  const isEven = index % 2 === 0;
  const Icon = step.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "relative flex items-center w-full",
        isEven ? 'md:flex-row-reverse' : 'md:flex-row'
      )}
    >
      {/* 1. المحتوى النصي (Ultra-Modern Glassmorphism) */}
      <div className="w-full md:w-[46%] pr-10 md:pr-0">
        <motion.div 
          whileHover={{ y: -5, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          className="relative p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.06] backdrop-blur-3xl hover:border-white/20 transition-all duration-700 group cursor-pointer overflow-hidden transform-gpu"
        >
          {/* رقم المرحلة "Ghost Typography" */}
          <span className="absolute -top-10 -left-6 text-[12rem] font-black text-white/[0.02] group-hover:text-white/[0.04] transition-all duration-1000 pointer-events-none select-none italic">
            0{step.id}
          </span>

          <div className="relative z-10 text-right">
             <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 mr-0 ml-auto md:ml-0 md:mr-auto shadow-2xl transition-transform duration-700 group-hover:rotate-[10deg]"
              style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}
            >
              <Icon size={30} style={{ color: step.color }} className="group-hover:scale-110 transition-all" />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-black text-white mb-6 font-cairo tracking-tight">
              {step.title}
            </h3>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-cairo opacity-70 group-hover:opacity-100 transition-opacity">
              {step.desc}
            </p>
          </div>
          
          {/* خط التفاعل السفلي */}
          <div 
            className="absolute bottom-0 right-0 h-[3px] transition-all duration-1000 w-0 group-hover:w-full opacity-50"
            style={{ backgroundColor: step.color, boxShadow: `0 0 20px ${step.color}` }}
          />
        </motion.div>
      </div>

      {/* 2. النقطة المضيئة (Neon Node) */}
      <div className="absolute right-[12px] md:right-1/2 w-8 h-8 md:w-12 md:h-12 translate-x-1/2 flex items-center justify-center z-30">
        <div className="relative">
          <motion.div 
            whileInView={{ 
              scale: [1, 1.2, 1],
              borderColor: [step.color, "#fff", step.color]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-black border-2 relative z-10"
            style={{ borderColor: step.color }}
          />
          <motion.div 
            animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-[-15px] rounded-full blur-xl"
            style={{ backgroundColor: step.color }}
          />
        </div>
      </div>

      {/* 3. Spacer (Desktop Only) */}
      <div className="hidden md:block md:w-[46%]" />
    </motion.div>
  );
}