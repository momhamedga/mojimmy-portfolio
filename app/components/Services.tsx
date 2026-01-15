"use client"
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, useMotionValue, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { Layout, Code2, Rocket, Smartphone, ArrowUpRight } from "lucide-react";

const services = [
  {
    title: "UI/UX DESIGN",
    arabic: "تصميم الواجهات",
    desc: "نحول الأفكار المعقدة إلى واجهات بسيطة وجذابة بصرياً تركز على تجربة المستخدم.",
    icon: <Layout className="w-8 h-8 md:w-12 md:h-12 text-purple-400" />,
    color: "#a855f7" 
  },
  {
    title: "WEB DEV",
    arabic: "تطوير الويب",
    desc: "بناء مواقع سريعة كالبرق باستخدام أحدث التقنيات لضمان أفضل أداء واستجابة.",
    icon: <Code2 className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />,
    color: "#3b82f6"
  },
  {
    title: "MOBILE APPS",
    arabic: "تطبيقات الجوال",
    desc: "تطوير تطبيقات Native و Cross-platform توفر تجربة مستخدم سلسة على iOS و Android.",
    icon: <Smartphone className="w-8 h-8 md:w-12 md:h-12 text-pink-400" />,
    color: "#ec4899"
  },
  {
    title: "PERFORMANCE",
    arabic: "تحسين الأداء",
    desc: "استراتيجيات متقدمة لضمان تصدر موقعك نتائج البحث وزيادة معدل التحويل.",
    icon: <Rocket className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />,
    color: "#10b981"
  },
];

const ServiceCard = memo(({ service, index, progress, range, targetScale }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // تفعيل الـ 3D فقط على الديسكتوب لضمان استقرار الموبايل
  const rotateX = useTransform(smoothY, [-200, 200], [5, -5]);
  const rotateY = useTransform(smoothX, [-200, 200], [-5, 5]);
  const scale = useTransform(progress, range, [1, targetScale]);
  
  const background = useMotionTemplate`
    radial-gradient(
      ${isMobile ? '300px' : '650px'} circle at ${smoothX}px ${smoothY}px,
      ${service.color}15,
      transparent 80%
    )
  `;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }, [mouseX, mouseY]);

  return (
    <div className="h-[100vh] md:h-screen flex items-center justify-center sticky top-0 px-4 md:px-6 pointer-events-none">
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(-1000); mouseY.set(-1000); }}
        style={{ 
          scale,
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="pointer-events-auto group relative w-full max-w-4xl h-[40vh] md:h-[550px] rounded-[2.5rem] md:rounded-[3rem] border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-2xl p-6 md:p-16 overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
      >
        {/* Glow Effect */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background }}
        />

        {/* Technical Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(${service.color} 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col h-full" style={{ transform: isMobile ? "none" : "translateZ(50px)" }}>
          <div className="flex justify-between items-start">
            <motion.div className="p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md text-white">
              {service.icon}
            </motion.div>
            <div className="flex flex-col items-end">
               <span className="text-white/10 font-mono text-5xl md:text-7xl font-black italic">0{index + 1}</span>
            </div>
          </div>
          
          <div className="mt-8 md:mt-12">
            <h3 className="text-4xl md:text-8xl font-black text-white mb-2 tracking-tighter leading-tight">
              {service.title}
            </h3>
            <p className="text-xl md:text-3xl font-bold text-white/30 mb-4 md:mb-6 font-arabic" dir="rtl">
              {service.arabic}
            </p>
            <p className="text-gray-400 leading-relaxed text-sm md:text-xl max-w-xl font-light">
              {service.desc}
            </p>
          </div>

          <motion.div 
            whileHover={{ x: 10 }}
            className="mt-auto flex items-center gap-4 md:gap-6 text-white font-bold cursor-pointer group/btn w-fit"
          >
            <div className="relative p-1">
                <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40 group-hover/btn:text-white transition-colors">Start Project</span>
                <div className="absolute bottom-0 left-0 h-[1px] bg-white/20 w-full group-hover/btn:bg-white transition-colors" />
            </div>
            <div className="p-3 md:p-4 rounded-full bg-white/5 border border-white/10 group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-500 shadow-xl">
               <ArrowUpRight size={20} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";

export default function Services() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={container} id="services" className="relative bg-transparent min-h-screen">
      {/* Title Section */}
      <div className="h-[40vh] md:h-[50vh] flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
             <h2 className="text-[20vw] font-black text-white/[0.02] select-none tracking-tighter uppercase">
                Creative
             </h2>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center gap-2"
        >
          <div className="w-8 md:w-12 h-[1px] bg-blue-500" />
          <p className="text-blue-500 font-mono tracking-[0.5em] md:tracking-[0.8em] text-[10px] md:text-xs uppercase pl-[0.8em]">
            Excellence in Execution
          </p>
        </motion.div>
      </div>

      {/* Cards Mapping */}
      <div className="relative">
        {services.map((service, index) => {
          // حساب الـ scale ليكون لكل كارت حجم مختلف قليلاً عند التكديس
          const targetScale = 0.9 + (index * 0.025); 
          return (
            <ServiceCard 
              key={index} 
              index={index} 
              service={service} 
              progress={scrollYProgress} 
              range={[index * 0.25, 1]} 
              targetScale={targetScale}
            />
          );
        })}
      </div>
      
      <div className="h-[20vh] md:h-[40vh]" />
    </section>
  );
}