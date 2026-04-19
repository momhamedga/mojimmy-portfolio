"use client"
import { useRef } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { Word } from "./Word";
import { AboutStats } from "./AboutStats";

const ABOUT_TEXT = "أنا مطور واجهات أمامية متخصص في تحويل الأفكار المعقدة إلى تجارب رقمية بسيطة ومبهرة. أؤمن بأن التفاصيل الصغيرة هي التي تصنع الفارق الكبير، ولذلك أهتم بكل بكسل وبكل حركة داخل الموقع لضمان تقديم أعلى جودة ممكنة للعملاء.";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] 
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  const words = ABOUT_TEXT.split(" ");
  // Spotlight خفيف جداً للموبايل عشان مياكلش الـ FPS
  const spotlightY = useTransform(smoothProgress, [0, 1], ["-10%", "110%"]);

  return (
    <motion.section 
      ref={containerRef} 
      dir="rtl" 
      className="relative py-20 md:py-72 overflow-hidden bg-transparent"
      id="about"
    >
      {/* Ambient Spotlight - Hidden on very small screens for performance */}
      <motion.div 
        style={{ top: spotlightY }}
        className="absolute left-1/2 -translate-x-1/2 w-[100vw] md:w-[60vw] h-[100vw] md:h-[60vw] bg-[oklch(0.6_0.2_285_/_0.08)] blur-[80px] md:blur-[150px] rounded-full -z-10 pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 md:gap-32">
          
          {/* الجانب الأيمن: Branding & Stats */}
          <div className="lg:col-span-4 lg:sticky lg:top-48 h-fit flex flex-col gap-10 md:gap-12">
            <div className="space-y-6 text-right">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md"
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span className="text-white/50 font-cairo text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">
                  Story Mode
                </span>
              </motion.div>
              
              <h3 className="text-4xl md:text-8xl font-cairo font-black text-white leading-[1.1] md:leading-[0.9] tracking-tighter">
                كود <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent italic">
                  بلمسة فن.
                </span>
              </h3>
            </div>

            {/* الإحصائيات تظهر هنا في الموبايل وتكون sticky في الديسكتوب */}
            <AboutStats progress={smoothProgress} />
          </div>

          {/* الجانب الأيسر: الكتابة المتفاعلة */}
          <div className="lg:col-span-8 mt-10 md:mt-0">
            <div className="flex flex-wrap content-start text-3xl sm:text-5xl md:text-8xl font-cairo font-bold leading-[1.3] md:leading-[1.05] tracking-tighter text-right text-white/10">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                return (
                  <Word key={i} range={[start, end]} progress={smoothProgress}>
                    {word}
                  </Word>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}