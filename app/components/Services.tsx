"use client"
import { motion, useMotionValue, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useCallback, memo } from "react";
import { Layout, Code2, Rocket, Smartphone, ArrowUpRight } from "lucide-react";

const services = [
  {
    title: "UI/UX DESIGN",
    arabic: "تصميم الواجهات",
    desc: "نحول الأفكار المعقدة إلى واجهات بسيطة وجذابة بصرياً تركز على تجربة المستخدم.",
    icon: <Layout className="w-12 h-12 text-purple-400" />,
    color: "rgba(168, 85, 247, 0.15)" 
  },
  {
    title: "WEB DEV",
    arabic: "تطوير الويب",
    desc: "بناء مواقع سريعة كالبرق باستخدام أحدث التقنيات لضمان أفضل أداء واستجابة.",
    icon: <Code2 className="w-12 h-12 text-blue-400" />,
    color: "rgba(59, 130, 246, 0.15)"
  },
  {
    title: "MOBILE APPS",
    arabic: "تطبيقات الجوال",
    desc: "تطوير تطبيقات Native و Cross-platform توفر تجربة مستخدم سلسة على iOS و Android.",
    icon: <Smartphone className="w-12 h-12 text-pink-400" />,
    color: "rgba(236, 72, 153, 0.15)"
  },
  {
    title: "PERFORMANCE",
    arabic: "تحسين الأداء",
    desc: "استراتيجيات متقدمة لضمان تصدر موقعك نتائج البحث وزيادة معدل التحويل.",
    icon: <Rocket className="w-12 h-12 text-emerald-400" />,
    color: "rgba(16, 185, 129, 0.15)"
  },
];

// استخدام memo لمنع إعادة الرندر غير الضرورية
const ServiceCard = memo(({ service, index, progress, range, targetScale }: any) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(smoothY, [-200, 200], [5, -5]);
  const rotateY = useTransform(smoothX, [-200, 200], [-5, 5]);
  
  // ضبط الـ Scale ليكون التراكم أوضح
  const scale = useTransform(progress, range, [1, targetScale]);
  const opacity = useTransform(progress, range, [1, 0.8]);

  const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div className="h-screen flex items-center justify-center sticky top-0 px-4 pointer-events-none">
      <motion.div
        style={{ 
          scale,
          rotateX,
          rotateY,
          opacity,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto group relative w-full max-w-5xl h-[500px] md:h-[550px] rounded-[2.5rem] border border-white/10 bg-[#080808]/90 backdrop-blur-2xl p-8 md:p-16 overflow-hidden shadow-2xl"
      >
        {/* Glow Effect المحسن */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-none"
          style={{ background: `radial-gradient(circle at center, ${service.color}, transparent 80%)` }}
        />

        <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(30px)" }}>
          <div className="flex justify-between items-start">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
              {service.icon}
            </div>
            <div className="text-right">
               <span className="text-blue-500 font-mono text-lg block font-bold tracking-tighter">0{index + 1}</span>
               <div className="h-[2px] w-8 bg-blue-500/30 mr-0 ml-auto mt-1" />
            </div>
          </div>
          
          <div className="mt-12 text-right md:text-left">
            <h3 className="text-5xl md:text-8xl font-black text-white mb-2 tracking-tighter group-hover:text-blue-400 transition-colors">
              {service.title}
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-gray-400 mb-6 font-arabic" dir="rtl">
              {service.arabic}
            </p>
            <p className="text-gray-400 leading-relaxed text-lg md:text-xl max-w-2xl font-light">
              {service.desc}
            </p>
          </div>

          <motion.div 
            whileHover={{ x: 10 }}
            className="mt-auto flex items-center gap-4 text-white font-bold cursor-pointer group/btn"
          >
            <span className="text-xs tracking-[0.2em] uppercase opacity-40 group-hover/btn:opacity-100 transition-opacity">Discover More</span>
            <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-300">
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
    <section ref={container} id="services" className="relative bg-[#030303]">
      {/* سكشن العنوان الخلفي */}
      <div className="h-[40vh] flex flex-col items-center justify-end pb-12">
        <h2 className="text-[16vw] leading-none font-black text-white/[0.03] absolute top-10 left-1/2 -translate-x-1/2 select-none pointer-events-none">
          OFFERING
        </h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-blue-500 font-mono tracking-[0.5em] text-xs uppercase relative z-10"
        >
          // Expertise & Solutions
        </motion.p>
      </div>

      <div className="relative">
        {services.map((service, index) => {
          // حساب الـ target scale ليكون التراكم متناسقاً
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
      
      {/* نهاية السكشن لضمان سلاسة الخروج */}
      <div className="h-[30vh]" />
    </section>
  );
}