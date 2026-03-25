"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMemo, useRef, useCallback } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { REVIEWS } from "@/src/constants/reviews-data";
import { ReviewCard } from "./ReviewCard";

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // 1. إعدادات السكرول والأنيميشن للخلفية
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const springScroll = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });
  
  const xLeft = useTransform(springScroll, [0, 1], [-400, 400]);
  const xRight = useTransform(springScroll, [0, 1], [400, -400]);
  const rotateBack = useTransform(springScroll, [0, 1], [-3, 3]);
  const rotateForward = useTransform(springScroll, [0, 1], [3, -3]);

  const bgRows = useMemo(() => [
    { style: { x: xLeft, rotate: rotateBack }, text: "LIMITLESS • CREATIVITY •", dir: "ltr" },
    { style: { x: xRight, rotate: rotateForward }, text: "إتقان • شغف • ريادة •", dir: "rtl" }
  ], [xLeft, xRight, rotateBack, rotateForward]);

  // 2. وظيفة السكرول البرمجي لضمان عمل الـ CTA
  const handleCTAClick = useCallback(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // تحديث المسار في المتصفح بدون إعادة تحميل
      window.history.pushState(null, '', '#contact');
    }
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="testimonials" 
      className="relative transform-gpu py-32 md:py-48 overflow-hidden select-none "
    >
      
      {/* Aura Lighting - Deep Cinematic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] bg-purple-600/5 blur-[160px] rounded-full pointer-events-none transform-gpu z-0" />

      {/* Background Typography Layer - Ultra Low Z-Index */}
      <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-[0.02] -z-10 select-none">
        {bgRows.map((row, idx) => (
          <motion.div 
            key={idx} 
            style={row.style} 
            className="flex gap-24 will-change-transform transform-gpu"
          >
            {[...Array(4)].map((_, i) => (
              <h2 
                key={i} 
                className={`text-[clamp(8rem,18vw,22rem)] font-cairo font-black whitespace-nowrap text-white ${idx === 0 ? 'italic' : ''}`} 
                dir={row.dir as "ltr" | "rtl"}
              >
                {row.text}
              </h2>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Cinematic Header */}
        <div className="text-right mb-32 md:mb-48 relative">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            viewport={{ once: true }}
            className="h-1.5 bg-gradient-to-l from-purple-600 to-transparent mb-10 inline-block rounded-full"
          />
          <h2 className="text-7xl md:text-[11rem] font-black text-white font-cairo leading-[0.75] tracking-tighter mb-8">
              شركاء <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 via-blue-500 to-emerald-400 animate-gradient-x">
                النجاح
              </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-2xl font-cairo max-w-2xl mr-auto leading-relaxed">
            قصص واقعية كُتبت بأكوادنا، نعتز بكل حرف قيل في حقنا من قادة السوق العربي.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch relative z-20">
          {REVIEWS.map((rev, i) => (
            <ReviewCard key={rev.id} review={rev} index={i} />
          ))}
        </div>

        {/* Final CTA - Enhanced Programmatic Version */}
        <div className="relative z-[100] mt-48 md:mt-64 flex justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCTAClick}
                className="relative p-[1px] rounded-[4rem] bg-gradient-to-br from-white/20 via-transparent to-white/10 overflow-hidden transform-gpu cursor-pointer group w-full max-w-5xl shadow-2xl"
            >
                <div className="p-16 md:p-32 rounded-[3.9rem] relative z-10 flex flex-col items-center">
                    
                    <motion.div 
                        animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Sparkles className="text-yellow-500 mb-10 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" size={70} />
                    </motion.div>
                    
                    <h3 className="text-5xl md:text-8xl font-cairo font-black text-white text-center leading-[1.1] mb-14 tracking-tighter">
                        هل أنت مستعد لتكون <br/> قصة النجاح القادمة؟
                    </h3>

                    <div className="relative flex items-center gap-6 px-14 py-7 font-cairo bg-white text-black rounded-full font-black text-2xl overflow-hidden transition-all duration-300 group-hover:pr-20 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                        <span className="relative z-10">ابدأ رحلتك معنا الآن</span>
                        <ArrowLeft className="absolute left-[-30px] group-hover:left-8 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}