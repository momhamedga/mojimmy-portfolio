"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef, memo } from "react";
import { PROCESS_STEPS } from "@/src/constants/process-steps";
import { cn } from "@/src/lib/utils";

export default function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"] // تحسين توقيت البداية والنهاية
  });

  const scaleY = useSpring(scrollYProgress, { 
    stiffness: 50, // تقليل القسوة شوية لسكرول أنعم (Lerp effect)
    damping: 20, 
    restDelta: 0.001 
  });

  return (
    <section ref={containerRef} id="process" className="relative py-32 md:py-48 overflow-hidden ">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* العنوان السينمائي */}
        <div className="mb-32 md:mb-56 text-right relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-primary font-cairo font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase block mb-6">
              Engineering Workflow
            </span>
            <h2 className="text-5xl md:text-8xl font-black text-white font-cairo leading-none tracking-tighter">
              رحلة تحويل <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary via-primary/50 to-accent">
                الفكرة
              </span> لواقع
            </h2>
          </motion.div>
        </div>

        <div className="relative min-h-[1200px]">
          {/* الخط المركزي - متصل بالـ Theme Colors */}
          <div className="absolute right-[12px] md:right-1/2 top-0 bottom-0 w-[2px] bg-white/[0.03] md:translate-x-1/2 overflow-hidden">
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute inset-0 w-full bg-gradient-to-b from-primary via-accent to-primary shadow-[0_0_30px_var(--color-primary)] will-change-transform"
            />
          </div>

          <div className="relative space-y-32 md:space-y-64">
            {PROCESS_STEPS.map((step, i) => (
              <StepItem key={step.id} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// استخدام memo لمنع إعادة رندر المراحل أثناء السكرول (Critical for performance)
const StepItem = memo(({ step, index }: { step: any, index: number }) => {
  const isEven = index % 2 === 0;
  const Icon = step.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
      className={cn(
        "relative flex items-center w-full",
        isEven ? 'md:flex-row-reverse' : 'md:flex-row'
      )}
    >
      {/* 1. الكارد الزجاجي */}
      <div className="w-full md:w-[45%] pr-12 md:pr-0">
        <motion.div 
          whileHover={{ y: -8, transition: { duration: 0.4 } }}
          className="group relative p-8 md:p-12 rounded-[2.5rem] bg-glass border border-white/5 backdrop-blur-3xl hover:border-primary/30 transition-all duration-700 cursor-default"
        >
          {/* رقم المرحلة Background */}
          <span className="absolute -top-10 -left-6 text-[10rem] font-black text-white/[0.01] group-hover:text-primary/[0.03] transition-colors duration-1000 italic select-none">
            0{step.id}
          </span>

          <div className="relative z-10 text-right">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ml-auto shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
              style={{ background: `var(--color-primary-transparent)`, border: `1px solid var(--color-primary-faded)` }}
            >
              <Icon size={28} className="text-primary group-hover:text-white transition-colors" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 font-cairo">
              {step.title}
            </h3>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-cairo opacity-70 group-hover:opacity-100 transition-opacity">
              {step.desc}
            </p>
          </div>
          
          {/* خط التفاعل السفلي النيوني */}
          <div className="absolute bottom-0 right-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-l from-primary to-transparent transition-all duration-700 shadow-[0_0_15px_var(--color-primary)]" />
        </motion.div>
      </div>

      {/* 2. النود المضيئة (The Neon Junction) */}
      <div className="absolute right-[12px] md:right-1/2 w-8 h-8 md:w-10 md:h-10 translate-x-1/2 flex items-center justify-center z-30">
        <div className="relative">
          <motion.div 
            whileInView={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 rounded-full bg-background border-2 border-primary relative z-10 shadow-[0_0_15px_var(--color-primary)]"
          />
          <div className="absolute inset-[-10px] rounded-full bg-primary/20 blur-md animate-pulse" />
        </div>
      </div>

      <div className="hidden md:block md:w-[45%]" />
    </motion.div>
  );
});

StepItem.displayName = "StepItem";