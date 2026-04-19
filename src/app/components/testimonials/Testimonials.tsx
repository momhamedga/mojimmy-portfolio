"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMemo, useRef, useCallback } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { REVIEWS } from "@/src/constants/reviews-data";
import { ReviewCard } from "./ReviewCard";

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const springProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });
  
  // جعل النص الخلفي يتحرك بسرعات مختلفة لزيادة عمق الـ Parallax
  const xLeft = useTransform(springProgress, [0, 1], [-200, 200]);
  const xRight = useTransform(springProgress, [0, 1], [200, -200]);

  const handleCTAClick = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="relative py-32 md:py-48 overflow-hidden ">
      
      {/* Background Typography */}
      <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-[0.03] select-none">
        <motion.div style={{ x: xLeft }} className="flex gap-20 whitespace-nowrap text-[12vw] font-black text-white italic">
          {Array(3).fill("LIMITLESS • CREATIVITY •").join(" ")}
        </motion.div>
        <motion.div style={{ x: xRight }} className="flex gap-20 whitespace-nowrap text-[12vw] font-black text-white" dir="rtl">
          {Array(3).fill("إتقان • شغف • ريادة •").join(" ")}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-right mb-24 md:mb-32">
          <motion.div initial={{ width: 0 }} whileInView={{ width: "80px" }} className="h-1 bg-primary mb-8 ml-auto rounded-full" />
          <h2 className="text-6xl md:text-9xl font-black text-white font-cairo leading-none tracking-tighter mb-6">
            شركاء <br/> <span className="text-primary">النجاح</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-cairo max-w-2xl ml-auto">
             نعتز بكل حرف قيل في حقنا من قادة السوق العربي.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
          {REVIEWS.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>

        {/* CTA Card */}
        <motion.div 
          onClick={handleCTAClick}
          whileHover={{ y: -10 }}
          className="mt-32 md:mt-48 p-12 md:p-24 rounded-[3rem] bg-glass border border-primary/20 text-center cursor-pointer group relative overflow-hidden"
        >
          <Sparkles className="text-yellow-500 mx-auto mb-8 animate-pulse" size={48} />
          <h3 className="text-4xl md:text-7xl font-black text-white mb-10 font-cairo">هل أنت مستعد لتكون قصة النجاح القادمة؟</h3>
          <div className="inline-flex items-center gap-4 px-10 py-5 bg-primary text-black rounded-full font-black text-xl hover:scale-105 transition-transform">
            <span>ابدأ رحلتك معنا</span>
            <ArrowLeft />
          </div>
        </motion.div>
      </div>
    </section>
  );
}