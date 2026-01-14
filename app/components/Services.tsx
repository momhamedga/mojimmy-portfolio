"use client"
import { motion, useMotionValue, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { useRef, useCallback, memo } from "react";
import { Layout, Code2, Rocket, Smartphone, ArrowUpRight } from "lucide-react";

const services = [
  {
    title: "UI/UX DESIGN",
    arabic: "تصميم الواجهات",
    desc: "نحول الأفكار المعقدة إلى واجهات بسيطة وجذابة بصرياً تركز على تجربة المستخدم.",
    icon: <Layout className="w-12 h-12 text-purple-400" />,
    color: "#a855f7" 
  },
  {
    title: "WEB DEV",
    arabic: "تطوير الويب",
    desc: "بناء مواقع سريعة كالبرق باستخدام أحدث التقنيات لضمان أفضل أداء واستجابة.",
    icon: <Code2 className="w-12 h-12 text-blue-400" />,
    color: "#3b82f6"
  },
  {
    title: "MOBILE APPS",
    arabic: "تطبيقات الجوال",
    desc: "تطوير تطبيقات Native و Cross-platform توفر تجربة مستخدم سلسة على iOS و Android.",
    icon: <Smartphone className="w-12 h-12 text-pink-400" />,
    color: "#ec4899"
  },
  {
    title: "PERFORMANCE",
    arabic: "تحسين الأداء",
    desc: "استراتيجيات متقدمة لضمان تصدر موقعك نتائج البحث وزيادة معدل التحويل.",
    icon: <Rocket className="w-12 h-12 text-emerald-400" />,
    color: "#10b981"
  },
];

const ServiceCard = memo(({ service, index, progress, range, targetScale }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(smoothY, [-200, 200], [5, -5]);
  const rotateY = useTransform(smoothX, [-200, 200], [-5, 5]);
  const scale = useTransform(progress, range, [1, targetScale]);
  
  // لمسة إبداعية: حدود مضيئة تتبع الماوس
  const background = useMotionTemplate`
    radial-gradient(
      650px circle at ${smoothX}px ${smoothY}px,
      ${service.color}20,
      transparent 80%
    )
  `;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }, [mouseX, mouseY]);

  return (
    <div className="h-screen flex items-center justify-center sticky top-0 px-4 pointer-events-none">
  <motion.div
  ref={containerRef}
  onMouseMove={handleMouseMove}
  onMouseLeave={() => { mouseX.set(-1000); mouseY.set(-1000); }}
  style={{ 
    scale,
    rotateX,
    rotateY,
    transformStyle: "preserve-3d",
    willChange: "transform, background", // تحسين أداء الـ GPU
  }}
  role="article"
  aria-label={`Service: ${service.title}`}
  className="pointer-events-auto group relative w-full max-w-5xl h-[500px] md:h-[550px] rounded-[3rem] border border-white/5 bg-black/20 backdrop-blur-xl p-8 md:p-16 overflow-hidden shadow-2xl"
>
        {/* خلفية التوهج المتحركة */}
     <motion.div 
    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
    style={{ background, filter: "blur(40px)" }} // إضافة blur بسيط للـ gradient
  />

        {/* خطوط تقنية تظهر في الخلفية عند الـ Hover */}
        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(${service.color} 1px, transparent 0)`, backgroundSize: '30px 30px' }} />

        <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(50px)" }}>
          <div className="flex justify-between items-start">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              {service.icon}
            </motion.div>
            <div className="flex flex-col items-end">
               <span className="text-white/20 font-mono text-5xl font-black leading-none italic leading-none">0{index + 1}</span>
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 className="h-[2px] bg-gradient-to-l from-transparent to-white/20 mt-2" 
               />
            </div>
          </div>
          
          <div className="mt-12">
            <motion.h3 
              className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tighter leading-tight"
              style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
            >
              {service.title}
            </motion.h3>
            <p className="text-2xl md:text-3xl font-bold text-white/40 mb-6 font-arabic" dir="rtl">
              {service.arabic}
            </p>
            <p className="text-gray-300 leading-relaxed text-lg md:text-xl max-w-xl font-light mix-blend-plus-lighter">
              {service.desc}
            </p>
          </div>

          <motion.div 
            whileHover={{ x: 15 }}
            className="mt-auto flex items-center gap-6 text-white font-bold cursor-pointer group/btn w-fit"
          >
            <div className="relative">
                <span className="text-xs tracking-[0.4em] uppercase text-white/40 group-hover/btn:text-white transition-colors">Start Project</span>
                <motion.div className="absolute -bottom-2 left-0 h-[1px] bg-white/40 w-full group-hover/btn:bg-white transition-colors" />
            </div>
            <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-500 shadow-xl">
               <ArrowUpRight size={22} />
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
      {/* سكشن العنوان الإبداعي العائم */}
      <div className="h-[50vh] flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
             <h2 className="text-[25vw] font-black text-white/[0.02] select-none tracking-tighter">
                CREATIVE
             </h2>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <div className="w-12 h-[1px] bg-blue-500" />
          <p className="text-blue-500 font-mono tracking-[0.8em] text-[10px] md:text-xs uppercase pl-[0.8em]">
            Excellence in Execution
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {services.map((service, index) => {
          const targetScale = 0.85 + (index * 0.04); 
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
      
      <div className="h-[40vh]" />
    </section>
  );
}