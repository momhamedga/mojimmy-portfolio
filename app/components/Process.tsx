"use client"
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, PencilRuler, Code2, Rocket, CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "الاكتشاف والتخطيط",
    desc: "نبدأ بفهم عميق لرؤيتك وتحويلها إلى خارطة طريق تقنية واضحة.",
    icon: <Lightbulb size={32} />,
    color: "#a855f7"
  },
  {
    title: "التصميم والتجربة",
    desc: "بناء واجهات مستخدم ساحرة تركز على سهولة الاستخدام وجذب الانتباه.",
    icon: <PencilRuler size={32} />,
    color: "#3b82f6"
  },
  {
    title: "التطوير السحري",
    desc: "تحويل التصاميم إلى أكواد نظيفة، سريعة، وقابلة للتوسع باستخدام أحدث التقنيات.",
    icon: <Code2 size={32} />,
    color: "#ec4899"
  },
  {
    title: "الإطلاق والاختبار",
    desc: "تأكد من أن كل تفصيلة تعمل بدقة 100% قبل خروج المشروع للنور.",
    icon: <Rocket size={32} />,
    color: "#10b981"
  }
];

export default function ProcessSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section ref={containerRef} id="process" className="relative py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* عنوان السكشن */}
        <div className="mb-32 text-right">
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-purple-500 font-mono tracking-widest text-sm uppercase"
          >
            How I Work
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-black text-white mt-4 font-arabic">
            رحلة تحويل <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-500 to-blue-500">الفكرة</span> لواقع
          </h2>
        </div>

        <div className="relative">
          {/* خط الطاقة المركزي (المحرك البصري) */}
          <div className="absolute right-8 md:right-1/2 top-0 bottom-0 w-[2px] bg-white/5 translate-x-1/2">
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute inset-0 w-full bg-gradient-to-b from-purple-500 via-blue-500 to-emerald-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            />
          </div>

          {/* المراحل */}
          <div className="space-y-40">
            {steps.map((step, i) => (
              <ProcessStep key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step, index }: any) {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-20%" }}
      className={`relative flex items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* 1. المحتوى النصي */}
      <div className="w-full md:w-[45%] text-right px-12 md:px-0">
        <motion.div 
          whileHover={{ x: isEven ? 10 : -10 }}
          className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-500 group"
        >
          <span className="text-6xl font-black text-white/5 absolute -top-10 right-4 group-hover:text-purple-500/10 transition-colors">
            0{index + 1}
          </span>
          <h3 className="text-2xl font-bold text-white mb-4 font-arabic flex items-center justify-end gap-3">
            {step.title}
            <span style={{ color: step.color }}>{step.icon}</span>
          </h3>
          <p className="text-gray-400 leading-relaxed font-arabic">
            {step.desc}
          </p>
        </motion.div>
      </div>

      {/* 2. نقطة الاتصال على الخط */}
      <div className="absolute right-8 md:right-1/2 w-16 h-16 translate-x-1/2 flex items-center justify-center">
        <motion.div 
          whileInView={{ scale: [1, 1.5, 1], backgroundColor: ["#111", step.color, "#111"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-4 h-4 rounded-full bg-white z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          style={{ boxShadow: `0 0 20px ${step.color}` }}
        />
        <div className="absolute inset-0 bg-white/5 rounded-full animate-ping opacity-20" />
      </div>

      {/* 3. مساحة فارغة للديسكتوب لتوازن التصميم */}
      <div className="hidden md:block md:w-[45%]" />
    </motion.div>
  );
}