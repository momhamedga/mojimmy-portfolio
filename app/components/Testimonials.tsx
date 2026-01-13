"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

const reviews = [
  {
    name: "أحمد محمد",
    role: "CEO, TechFlow",
    text: "التعامل كان احترافياً للغاية، النتيجة تجاوزت توقعاتي من حيث السرعة والجماليات الفائقة.",
    img: "https://i.pravatar.cc/150?u=1",
    color: "from-blue-500/20"
  },
  {
    name: "سارة خالد",
    role: "UI/UX Lead",
    text: "لديه عين فنية مبدعة وكود نظيف جداً. استطاع تحويل رؤيتنا إلى واقع رقمي مذهل.",
    img: "https://i.pravatar.cc/150?u=2",
    color: "from-purple-500/20"
  },
  {
    name: "John Doe",
    role: "Founder, StartupX",
    text: "The best developer I've worked with. Pure talent and amazing communication skills.",
    img: "https://i.pravatar.cc/150?u=3",
    color: "from-pink-500/20"
  },
  {
    name: "ياسين علي",
    role: "مدير مشاريع",
    text: "السرعة في التنفيذ والدقة في أصغر التفاصيل هي أكثر ما يميزه. تجربة استثنائية!",
    img: "https://i.pravatar.cc/150?u=4",
    color: "from-emerald-500/20"
  }
];

export default function Testimonials() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // تأثير البارالاكس للنصوص الخلفية
  const translateX = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <section ref={containerRef} id="testimonials" className="py-40 bg-transparent relative overflow-hidden">
      
      {/* 1. نص خلفي عملاق متحرك */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full pointer-events-none overflow-hidden opacity-[0.02] select-none">
        <motion.h2 style={{ x: translateX }} className="text-[30vw] font-black text-white whitespace-nowrap">
          TRUSTED BY LEADERS TRUSTED BY LEADERS
        </motion.h2>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-6 px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-mono tracking-widest uppercase"
          >
            Testimonials
          </motion.div>
          <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter italic uppercase">
            Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Success</span>
          </h2>
        </div>

        {/* 2. حاوية الكروت المتحركة بنظام الـ 3D Perspective */}
        <div className="relative group">
          {/* تأثير الـ Fade على الأطراف */}
          <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#030303] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[#030303] to-transparent z-20 pointer-events-none" />

          <motion.div 
            className="flex gap-8 py-20 cursor-grab active:cursor-grabbing"
            animate={{ x: [0, -2000] }}
            transition={{ 
              duration: 50, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {[...reviews, ...reviews, ...reviews].map((item, index) => (
              <motion.div 
                key={index} 
                whileHover={{ y: -20, scale: 1.05 }}
                className={`w-[350px] md:w-[500px] flex-shrink-0 p-10 rounded-[4rem] bg-white/[0.01] border border-white/5 backdrop-blur-xl relative group/card transition-all duration-700`}
              >
                {/* إضاءة علوية متغيرة */}
                <div className={`absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover/card:w-full transition-all duration-1000`} />
                
                <div className="flex justify-between items-start mb-10">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => <Star key={star} size={12} className="fill-purple-500 text-purple-500" />)}
                  </div>
                  <Quote size={40} className="text-white/10 group-hover/card:text-purple-500/20 transition-colors" />
                </div>

                <p className="text-gray-300 text-xl md:text-2xl leading-[1.6] mb-12 font-arabic rtl tracking-tight">
                  "{item.text}"
                </p>

                <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-8">
                  <div className="relative w-14 h-14">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-full h-full rounded-2xl object-cover grayscale group-hover/card:grayscale-0 transition-all duration-500" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center">
                       <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-white font-bold text-lg">{item.name}</h4>
                    <p className="text-gray-500 text-xs uppercase tracking-tighter">{item.role}</p>
                  </div>
                </div>

                {/* تأثير الـ Glow الخفي */}
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none">
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3. إحصائيات سريعة أسفل الشهادات */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Clients", val: "50+" },
            { label: "Projects", val: "120+" },
            { label: "Rating", val: "5.0" },
            { label: "Countries", val: "12" }
          ].map((stat, i) => (
            <div key={i} className="text-center border-l border-white/5 last:border-l-0">
               <h5 className="text-4xl md:text-5xl font-black text-white mb-2">{stat.val}</h5>
               <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}