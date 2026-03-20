"use client"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { REVIEWS } from "@/src/constants/reviews-data";
import { ReviewCard } from "./ReviewCard";
import Link from "next/link";

export default function Testimonials() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // أنيميشن النصوص الخلفية بطريقة الـ Parallax المتقاطع
  const xLeft = useTransform(scrollYProgress, [0, 1], [-500, 500]);
  const xRight = useTransform(scrollYProgress, [0, 1], [500, -500]);
  const rotateBack = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section ref={sectionRef} id="testimonials" className="relative py-32 bg-[#020202] overflow-hidden select-none">
      
      {/* تأثير الـ Aura (الإضاءة المحيطية) المتغيرة */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* النصوص الخلفية العملاقة - Layer 1 */}
      <div className="absolute inset-0 flex flex-col justify-around pointer-events-none opacity-[0.04] select-none">
        <motion.div style={{ x: xLeft, rotate: rotateBack }} className="flex gap-20">
           {[...Array(3)].map((_,i) => (
             <h2 key={i} className="text-[20vw] font-black whitespace-nowrap text-white italic">LIMITLESS • CREATIVITY •</h2>
           ))}
        </motion.div>
        <motion.div style={{ x: xRight, rotate: -rotateBack }} className="flex gap-20">
           {[...Array(3)].map((_,i) => (
             <h2 key={i} className="text-[20vw] font-black whitespace-nowrap text-white font-arabic" dir="rtl">إتقان • شغف • ريادة •</h2>
           ))}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* هيدر سينمائي */}
        <div className="text-right mb-32 relative">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            className="h-1 bg-gradient-to-l from-purple-600 to-transparent mb-8 inline-block"
          />
          <h2 className="text-7xl md:text-[10rem] font-black text-white font-arabic leading-[0.8] tracking-tighter mb-4">
             شركاء <br /> 
             <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 via-blue-500 to-emerald-400 animate-gradient-x">
               النجاح
             </span>
          </h2>
          <p className="text-gray-500 text-lg md:text-2xl font-light max-w-xl mr-auto">
            قصص واقعية كُتبت بأكوادنا، نعتز بكل حرف قيل في حقنا من قادة السوق العربي.
          </p>
        </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch px-4">
  {REVIEWS.map((rev, i) => (
    <ReviewCard key={rev.id} review={rev} index={i} />
  ))}
</div>

        {/* الـ CTA الإبداعي الأخير - Magnetic Feel */}
        <Link href={"#contact"} className="group block mt-40">
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            className="relative p-1 rounded-[4rem] bg-gradient-to-br from-white/10 via-transparent to-white/5 overflow-hidden"
          >
            <div className="bg-[#050505] p-12 md:p-20 rounded-[3.8rem] relative z-10 flex flex-col items-center">
               <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
               >
                 <Sparkles className="text-yellow-500 mb-8" size={60} />
               </motion.div>
               
               <h3 className="text-4xl md:text-7xl font-black text-white font-arabic text-center leading-tight mb-10">
                 هل أنت مستعد لتكون <br/> قصة النجاح القادمة؟
               </h3>

               <motion.button 
                whileTap={{ scale: 0.9 }}
                className="group relative flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black text-xl overflow-hidden transition-all hover:pr-16"
               >
                 <span>ابدأ رحلتك معنا الآن</span>
                 <ArrowLeft className="absolute left-[-20px] group-hover:left-4 transition-all opacity-0 group-hover:opacity-100" />
               </motion.button>
               
               {/* تأثير الضوء المتحرك داخل الكارت */}
               <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}