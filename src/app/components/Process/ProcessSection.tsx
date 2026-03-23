"use client"
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { PROCESS_STEPS } from "@/src/constants/process-steps";

export default function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // تتبع السكرول لرسم الخط الضوئي
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section ref={containerRef} id="process" className="relative py-24 md:py-40  overflow-hidden selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* العنوان الرئيسي */}
        <div className="mb-24 md:mb-40 text-right">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-purple-500 font-cairo  tracking-[0.3em] text-xs md:text-sm uppercase block mb-4">
              Step-by-Step Excellence
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-white font-cairo  leading-tight">
              رحلة تحويل <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-500 via-blue-500 to-emerald-500">الفكرة</span> لواقع
            </h2>
          </motion.div>
        </div>

        <div className="relative">
          {/* الخط المركزي (المسار الضوئي) */}
          {/* في الموبايل يثبت جهة اليمين، في الديسكتوب يتوسط الشاشة */}
          <div className="absolute right-[20px] md:right-1/2 top-0 bottom-0 w-[2px] bg-white/[0.05] translate-x-1/2">
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute inset-0 w-full bg-gradient-to-b from-purple-500 via-blue-400 to-emerald-500 shadow-[0_0_25px_rgba(168,85,247,0.6)]"
            />
          </div>

          {/* عرض المراحل */}
          <div className="space-y-24 md:space-y-48">
            {PROCESS_STEPS.map((step, i) => (
              <StepItem key={step.id} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepItem({ step, index }: { step: any, index: number }) {
  const isEven = index % 2 === 0;
  const Icon = step.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className={`relative flex items-center w-full ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* 1. المحتوى النصي (تفاعلي بالكامل مع التاتش) */}
      <div className="w-full md:w-[45%] pr-12 md:pr-0">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }} // تأثير الضغط للموبايل
          className="relative p-6 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] backdrop-blur-xl hover:border-white/20 transition-all duration-500 group overflow-hidden cursor-default"
        >
          {/* رقم المرحلة كخلفية */}
          <span className="absolute -top-6 -left-4 text-9xl font-black text-white/[0.02] group-hover:text-white/[0.05] transition-colors pointer-events-none select-none">
            {step.id}
          </span>

          <div className="relative z-10 text-right">
             <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mr-0 ml-auto md:ml-0 md:mr-auto"
              style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}
            >
              <Icon size={32} style={{ color: step.color }} className="group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-cairo ">
              {step.title}
            </h3>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-cairo  opacity-80 group-hover:opacity-100 transition-opacity">
              {step.desc}
            </p>
          </div>
          
          {/* خط التفاعل السفلي */}
          <div 
            className="absolute bottom-0 right-0 h-1 transition-all duration-700 w-0 group-hover:w-full"
            style={{ backgroundColor: step.color }}
          />
        </motion.div>
      </div>

      {/* 2. النقطة المضيئة على المسار */}
      <div className="absolute right-[20px] md:right-1/2 w-10 h-10 translate-x-1/2 flex items-center justify-center z-20">
        <motion.div 
          whileInView={{ 
            scale: [1, 1.4, 1],
            boxShadow: [`0 0 0px ${step.color}`, `0 0 20px ${step.color}`, `0 0 0px ${step.color}`] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-4 h-4 rounded-full bg-black border-2 z-10"
          style={{ borderColor: step.color }}
        />
        {/* هالة خارجية للموبايل لإعطاء عمق بصري */}
        <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse" />
      </div>

      {/* 3. مساحة توازن للتصميم (ديسكتوب فقط) */}
      <div className="hidden md:block md:w-[45%]" />
    </motion.div>
  );
}