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

  // تنعيم حركة السكرول للموبايل (Spring Physics)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const backgroundColor = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    ["#030303", "#0c0416", "#0c0416", "#030303"]
  );

  const words = ABOUT_TEXT.split(" ");
  const spotlightY = useTransform(smoothProgress, [0, 1], ["-10%", "110%"]);

  return (
    <motion.section 
      ref={containerRef} 
      dir="rtl" 
      style={{ backgroundColor }} 
      className="relative py-20 md:py-64 overflow-hidden transition-colors duration-700"
      id="about"
    >
      {/* Spotlight أصغر وأقوى على الموبايل */}
      <motion.div 
        style={{ top: spotlightY }}
        className="absolute left-1/2 -translate-x-1/2 w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] bg-purple-600/15 blur-[80px] md:blur-[130px] rounded-full -z-10 pointer-events-none"
      />

      <div className="container mx-auto px-5 md:px-6 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 md:gap-24">
          
          {/* الجانب الأيمن: العنوان - في الموبايل بياخد وضع حر وفي الديسكتوب ثابت */}
          <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-purple-400 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
                  من أنـا
                </span>
              </div>
              
              <h3 className="text-4xl md:text-7xl font-black text-white leading-[1.1] md:leading-[0.9] tracking-tighter">
                نمزج الفن <br className="hidden md:block" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                  بالكود.
                </span>
              </h3>
            </div>

            <AboutStats progress={smoothProgress} />
          </div>

          {/* الجانب الأيسر: النص المتفاعل - حجم خط مرن للموبايل */}
          <div className="lg:col-span-8">
            <p className="flex flex-wrap content-start text-[1.75rem] sm:text-4xl md:text-7xl font-bold leading-[1.3] md:leading-[1.1] tracking-tighter text-right">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                return (
                  <Word key={i} range={[start, end]} progress={smoothProgress}>
                    {word}
                  </Word>
                );
              })}
            </p>
          </div>

        </div>
      </div>
    </motion.section>
  );
}