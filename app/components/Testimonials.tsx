"use client"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { Quote, Star, Sparkles } from "lucide-react";

const reviews = [
  { name: "أحمد محمد", role: "CEO", text: "احترافية تتجاوز التوقعات في التنفيذ والسرعة.", color: "#a855f7" },
  { name: "سارة خالد", role: "Designer", text: "كود نظيف ورؤية فنية مذهلة في كل تفصيلة.", color: "#3b82f6" },
  { name: "ياسين علي", role: "Manager", text: "سرعة ودقة استثنائية في تحويل الأفكار لواقع.", color: "#ec4899" },
  { name: "ليلى محمود", role: "Founder", text: "أفضل مطور واجهات تعاملت معه على الإطلاق.", color: "#10b981" },
  { name: "عمر خالد", role: "Expert", text: "تجربة مستخدم تفوق الوصف بصراحة، اهتمام بالتفاصيل.", color: "#f59e0b" },
];

export default function Testimonials() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const xRight = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <section ref={containerRef} className="relative py-32 bg-black overflow-hidden select-none">
      
      {/* 1. الخلفية المتحركة (البهارات البصرية) */}
      <div className="absolute inset-0 flex flex-col justify-center gap-12 pointer-events-none opacity-[0.02]">
        <motion.h2 style={{ x: xLeft }} className="text-[18vw] font-black whitespace-nowrap text-white outline-text">
           EXPERIENCE • QUALITY • VISION •
        </motion.h2>
        <motion.h2 style={{ x: xRight }} className="text-[18vw] font-black whitespace-nowrap text-white font-arabic" dir="rtl">
           إبداع • إتقان • تميز •
        </motion.h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* 2. العنوان مع لمسة Sparkles */}
        <div className="text-center mb-24 relative">
          <motion.div 
            animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20"
          >
            <Sparkles className="text-purple-500" size={60} />
          </motion.div>
          <motion.span className="text-purple-500 font-mono tracking-[0.4em] text-[10px] uppercase block mb-4">Client Voices</motion.span>
          <h2 className="text-5xl md:text-7xl font-bold text-white font-arabic leading-tight">
             ثقة <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">تُبنى</span> بالتجربة
          </h2>
        </div>

        {/* 3. شبكة الكروت المطورة */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {reviews.map((rev, i) => (
            <EnhancedCard key={i} review={rev} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EnhancedCard({ review, index }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // تأثير الـ Tilt (الإمالة)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function onMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="break-inside-avoid relative p-1px rounded-[2.5rem] group overflow-hidden bg-gradient-to-br from-white/10 to-transparent"
    >
      {/* تأثير الـ Spotlight الداخلي */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, ${review.color}20, transparent 40%)`
        }}
      />

      <div className="relative z-10 p-8 bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[2.5rem] h-full flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <motion.div 
             animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
             className="p-3 rounded-2xl bg-white/[0.03] border border-white/5"
          >
            <Quote size={24} style={{ color: review.color }} />
          </motion.div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ delay: i * 0.2, repeat: Infinity, duration: 2 }}>
                <Star size={10} className="fill-yellow-500 text-yellow-500" />
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-gray-300 text-[17px] leading-[1.8] text-right font-arabic mb-8 flex-1" dir="rtl">
          {review.text}
        </p>

        <div className="flex flex-row-reverse items-center gap-4 pt-6 border-t border-white/5">
          <div className="relative">
             <div className="w-12 h-12 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center font-bold text-white">
                {review.name[0]}
             </div>
             <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
          </div>
          <div className="text-right">
            <h4 className="text-white font-bold text-sm">{review.name}</h4>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">{review.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}