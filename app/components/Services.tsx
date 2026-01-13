"use client"
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useCallback } from "react";
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

function ServiceCard({ service, index, progress, range, targetScale }: any) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  const rotateX = useTransform(smoothY, [-200, 200], [7, -7]);
  const rotateY = useTransform(smoothX, [-200, 200], [-7, 7]);
  const scale = useTransform(progress, range, [1, targetScale]);

  // تحسين الأداء عبر requestAnimationFrame
  const handleMouseMove = useCallback(({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    requestAnimationFrame(() => {
      mouseX.set(x);
      mouseY.set(y);
    });
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
          transformStyle: "preserve-3d",
          willChange: "transform, opacity" // تحسين أداء المتصفح
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto group relative w-full max-w-5xl h-[450px] md:h-[500px] rounded-[3rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-8 md:p-16 overflow-hidden transition-all duration-500 hover:border-white/20"
      >
        {/* إضاءة ثابتة خفيفة للأداء العالي */}
        <div 
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700"
          style={{ background: `radial-gradient(circle at center, ${service.color}, transparent 70%)` }}
        />

        <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(40px)" }}>
          <div className="flex justify-between items-start">
            <motion.div 
              className="p-5 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors"
            >
              {service.icon}
            </motion.div>
            
            <div className="flex flex-col items-end gap-2 text-right">
               <span className="text-purple-500 font-mono tracking-widest text-sm">0{index + 1}</span>
               <div className="h-px w-12 bg-purple-500/50" />
            </div>
          </div>
          
          <div className="mt-10 md:mt-12">
            <h3 className="text-4xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase italic">
              {service.title}
            </h3>
            <p className="text-xl md:text-2xl font-bold text-gray-500 mb-6 rtl">
              {service.arabic}
            </p>
            
            <p className="text-gray-400 leading-relaxed text-base md:text-lg max-w-xl font-medium">
              {service.desc}
            </p>
          </div>

          <motion.button 
            aria-label={`Explore ${service.title} projects`}
            whileHover={{ x: 10 }}
            className="mt-auto flex items-center gap-4 text-white font-bold cursor-pointer group/btn w-fit"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-50">Explore Project</span>
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover/btn:bg-white group-hover/btn:text-black transition-all">
               <ArrowUpRight size={18} />
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={container} id="services" className="relative bg-[#030303]">
      {/* سكشن العنوان الجانبي المحسن */}
      <div className="h-[30vh] flex flex-col items-center justify-center relative overflow-hidden">
        <h2 className="text-[18vw] font-black text-white/[0.02] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
          SERVICES
        </h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative z-10 text-blue-500 font-mono tracking-[0.6em] text-[10px] md:text-xs uppercase"
        >
          ✦ My Creative Stack ✦
        </motion.p>
      </div>

      <div className="relative">
        {services.map((service, index) => {
          const targetScale = 1 - ((services.length - index) * 0.05); 
          return (
            <ServiceCard 
              key={index} 
              index={index} 
              service={service} 
              progress={scrollYProgress} 
              range={[index * 0.25, (index + 1) * 0.25]} // تعديل المدى ليكون أكثر دقة
              targetScale={targetScale}
            />
          );
        })}
      </div>

      {/* مساحة فارغة في النهاية لضمان اكتمال السكرول للبطاقة الأخيرة */}
      <div className="h-[20vh]" />
    </section>
  );
}