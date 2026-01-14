"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

const reviews = [
  {
    name: "أحمد محمد",
    role: "رئيس تنفيذي، TechFlow",
    text: "التعامل كان احترافياً للغاية، النتيجة تجاوزت توقعاتي من حيث السرعة والجماليات الفائقة والدقة في التنفيذ.",
    img: "https://i.pravatar.cc/150?u=1",
  },
  {
    name: "سارة خالد",
    role: "مديرة تصميم واجهات",
    text: "لديه عين فنية مبدعة وكود نظيف جداً. استطاع تحويل رؤيتنا إلى واقع رقمي مذهل يتفاعل مع المستخدم بسلاسة.",
    img: "https://i.pravatar.cc/150?u=2",
  },
  {
    name: "ياسين علي",
    role: "مدير مشاريع تقنية",
    text: "السرعة في التنفيذ والدقة في أصغر التفاصيل هي أكثر ما يميزه. تجربة استثنائية وأنصح بالتعامل معه دائماً.",
    img: "https://i.pravatar.cc/150?u=4",
  },
  {
    name: "ليلى محمود",
    role: "مؤسسة Startup X",
    text: "أفضل مطور واجهات تعاملت معه، يفهم احتياجات العمل ويحولها لتصميم ينبض بالحياة.",
    img: "https://i.pravatar.cc/150?u=9",
  }
];

export default function Testimonials() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // تحسين تأثير الـ Parallax ليكون أنعم
  const translateX = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <section ref={containerRef} id="testimonials" className="py-40 bg-transparent relative overflow-hidden" dir="rtl">
      
      {/* 1. النص الخلفي - تم تقليل الـ Stroke لضمان عدم حجب الـ Grid */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full pointer-events-none overflow-hidden select-none z-0">
        <motion.h2 
          style={{ x: translateX, WebkitTextStroke: '1px rgba(255,255,255,0.02)' }} 
          className="text-[22vw] font-black text-transparent whitespace-nowrap uppercase italic leading-none"
        >
          قالوا عني قالوا عني قالوا عني قالوا عني
        </motion.h2>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-4 px-4 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-[10px] font-mono tracking-[0.3em] uppercase"
          >
            Testimonials
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic">
            آراء <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-purple-600">الشركاء</span>
          </h2>
        </div>

        {/* 2. الـ Infinite Slider - تم استخدام masking لضمان تلاشي الأطراف مع الـ Grid */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div 
            className="flex gap-8 w-max px-4 py-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 35, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {[...reviews, ...reviews].map((item, index) => (
              <motion.div 
                key={index} 
                whileHover={{ y: -10 }}
                className="w-[380px] md:w-[500px] flex-shrink-0 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-md relative group/card transition-all duration-700"
              >
                {/* خط إضاءة علوي */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent group-hover/card:w-2/3 transition-all duration-700" />
                
                <div className="flex justify-between items-start mb-10">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Quote size={24} className="text-purple-500 rotate-180" />
                  </div>
                  <div className="flex gap-1 pt-2">
                    {[1,2,3,4,5].map(star => <Star key={star} size={10} className="fill-yellow-500 text-yellow-500" />)}
                  </div>
                </div>

                <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 font-medium text-right">
                  "{item.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-500" />
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-white font-bold text-lg">{item.name}</h4>
                    <p className="text-purple-400/60 text-xs font-mono uppercase">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3. الإحصائيات - تم تعديلها لتكون متناغمة مع الخلفية الموحدة */}
        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 pt-20">
          {[
            { label: "عميل سعيد", val: "50+" },
            { label: "مشروع مكتمل", val: "120+" },
            { label: "تقييم عام", val: "5.0" },
            { label: "دولة حول العالم", val: "12" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center md:text-right"
            >
               <h5 className="text-5xl md:text-6xl font-black text-white hover:text-purple-500 transition-colors duration-500">
                 {stat.val}
               </h5>
               <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}