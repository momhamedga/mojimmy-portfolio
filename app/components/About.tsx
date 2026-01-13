"use client"
import { motion, useScroll, useTransform, MotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

interface WordProps {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"]
  });

  const text = "أنا مطور واجهات أمامية متخصص في تحويل الأفكار المعقدة إلى تجارب رقمية بسيطة ومبهرة. أؤمن بأن التفاصيل الصغيرة هي التي تصنع الفارق الكبير، ولذلك أهتم بكل بكسل وبكل حركة داخل الموقع لضمان تقديم أعلى جودة ممكنة للعملاء.";
  const words = text.split(" ");

  return (
    <section ref={containerRef} dir="rtl" className="py-40 relative overflow-hidden" id="about">
      {/* 1. خلفية Spotlight تتحرك مع السكرول */}
      <motion.div 
        style={{ 
          top: useTransform(scrollYProgress, [0, 1], ["20%", "80%"]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.4, 0.4, 0])
        }}
        className="absolute left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] -z-10 pointer-events-none"
      />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* العنوان الجانبي المطور */}
          <div className="lg:sticky lg:top-40 w-full lg:w-1/3 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-purple-400 font-mono text-[10px] uppercase tracking-widest">// من أنـا</span>
            </div>
            
            <h3 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter">
              نمزج الفن <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">بالكود.</span>
            </h3>

            {/* إحصائيات سريعة تظهر مع السكرول */}
            <div className="pt-10 space-y-4 border-t border-white/5">
              <div className="flex justify-between items-end">
                <span className="text-gray-500 font-mono text-xs uppercase">الخبرة التقنية</span>
                <span className="text-white font-black text-2xl">99%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "99%"]) }}
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600" 
                />
              </div>
            </div>
          </div>

          {/* النص التفاعلي مع لمسة Shimmer */}
          <div className="w-full lg:w-2/3">
            <p className="flex flex-wrap gap-x-4 gap-y-6 text-3xl md:text-6xl font-bold leading-[1.1] tracking-tighter">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                return (
                  <Word key={i} range={[start, end]} progress={scrollYProgress}>
                    {word}
                  </Word>
                );
              })}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

function Word({ children, range, progress }: WordProps) {
  // تأثير الظهور التدريجي مع "رفرفة" خفيفة في الـ Scale
  const opacity = useTransform(progress, range, [0.1, 1]);
  const scale = useTransform(progress, range, [0.95, 1]);
  const blur = useTransform(progress, range, ["4px", "0px"]);

  return (
    <span className="relative inline-block">
      <span className="absolute opacity-[0.03] text-white">{children}</span>
      <motion.span 
        style={{ opacity, scale, filter: `blur(${blur})` }} 
        className="text-white drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]"
      >
        {children}
      </motion.span>
    </span>
  );
}