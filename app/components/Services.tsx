"use client"
import { motion, useMotionValue, useMotionTemplate, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
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
  const container = useRef(null);
  
  // إحداثيات الماوس للتأثير المغناطيسي
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // تنعيم حركة الماوس
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // تأثير الـ Tilt (المالان)
  const rotateX = useTransform(smoothY, [-200, 200], [10, -10]);
  const rotateY = useTransform(smoothX, [-200, 200], [-10, 10]);

  const scale = useTransform(progress, range, [1, targetScale]);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="h-screen flex items-center justify-center sticky top-0 px-4 pointer-events-none">
      <motion.div
        style={{ 
          scale,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto group relative w-full max-w-5xl h-[500px] rounded-[3rem] border border-white/10 bg-white/[0.01] backdrop-blur-[12px] p-8 md:p-16 overflow-hidden transition-all duration-500 hover:border-white/20"
      >
        {/* إضاءة خلفية ثابتة خفيفة */}
        <div 
          className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40"
          style={{ background: `radial-gradient(circle at center, ${service.color}, transparent 70%)` }}
        />

        {/* كشاف الماوس المتحرك */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[3rem] opacity-0 group-hover:opacity-100 transition duration-300"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                450px circle at ${useTransform(smoothX, (v) => v + 450)}px ${useTransform(smoothY, (v) => v + 250)}px,
                ${service.color.replace('0.15', '0.4')},
                transparent 80%
              )
            `,
          }}
        />

        <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(50px)" }}>
          <div className="flex justify-between items-start">
            <motion.div 
              initial={{ rotate: -10 }}
              whileInView={{ rotate: 0 }}
              className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 group-hover:bg-white/[0.08] transition-colors"
            >
              {service.icon}
            </motion.div>
            
            <div className="flex flex-col items-end gap-2 text-right">
               <span className="text-purple-500 font-mono tracking-widest text-sm">0{index + 1}</span>
               <div className="h-px w-12 bg-purple-500/50" />
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-5xl md:text-8xl font-black text-white mb-2 tracking-tighter opacity-90 group-hover:opacity-100 transition-opacity">
              {service.title}
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-gray-500 mb-6 font-arabic rtl">
              {service.arabic}
            </p>
            
            <p className="text-gray-400 leading-relaxed text-lg md:text-xl max-w-xl font-light">
              {service.desc}
            </p>
          </div>

          <motion.div 
            whileHover={{ x: 10 }}
            className="mt-auto flex items-center gap-4 text-white font-bold cursor-pointer group/btn"
          >
            <span className="text-sm tracking-widest uppercase">Explore Project</span>
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover/btn:bg-white group-hover/btn:text-black transition-all">
               <ArrowUpRight size={20} />
            </div>
          </motion.div>
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
    <section ref={container} id="services" className="relative bg-transparent">
      {/* سكشن العنوان الجانبي */}
      <div className="h-[40vh] flex flex-col items-center justify-end pb-20">
        <h2 className="text-[15vw] leading-none font-black text-white/5 absolute top-20 left-1/2 -translate-x-1/2 select-none">
          SERVICES
        </h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-purple-500 font-mono tracking-[0.5em] text-sm uppercase"
        >
          My Creative Stack
        </motion.p>
      </div>

      <div className="relative">
        {services.map((service, index) => {
          const targetScale = 1 - ((services.length - index) * 0.04); 
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
    </section>
  );
}